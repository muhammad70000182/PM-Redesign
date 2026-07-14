import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
} from '@angular/core';

/**
 * SidebarNavGroupManagerDirective
 *
 * Manages which top-level sidebar nav-group appears "active" using a custom
 * `nav-group-active` CSS class. This class is styled to match the visual
 * appearance of CoreUI's `.show` class (background, toggle color, arrow rotation).
 *
 * Why a custom class instead of manipulating `show`:
 * CoreUI's `SidebarNavGroupComponent` drives the `show` class via Angular's
 * `@HostBinding('class')` getter `{ show: this.open }`. Angular's change
 * detection will always override any manual class manipulation on that binding.
 * The custom `nav-group-active` class lives outside Angular's binding system
 * and is therefore persistent.
 *
 * Behavior:
 * - When a top-level group is opened → it becomes the active group.
 *   `nav-group-active` is moved to it; removed from any previous active group.
 * - When the active group is collapsed → it STAYS marked `nav-group-active`.
 *   The arrow/submenu close via CoreUI's animation (`open` flag), but the
 *   "active" visual (background, toggle color, arrow) remains.
 * - When a DIFFERENT group is opened → `nav-group-active` shifts to that group.
 *   The previously active group's `nav-group-active` is removed.
 * - Sidebar collapse/expand: `nav-group-active` is never touched — state persists.
 * - Nested sub-groups are ignored (only top-level groups are managed).
 */
@Directive({
  selector: 'c-sidebar-nav[sidebarNavGroupManager]',
})
export class SidebarNavGroupManagerDirective implements AfterViewInit, OnDestroy {

  private mutationObserver: MutationObserver | null = null;
  /** Cleanup fn returned by the outside-zone click listener. */
  private removeClickListener: (() => void) | null = null;
  /** The currently active top-level nav group element. */
  private activeGroup: HTMLElement | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    // Run outside Angular's zone so that:
    // 1. MutationObserver callbacks don't trigger unnecessary change detection.
    // 2. Direct classList manipulation doesn't trigger change detection.
    // 3. Click listener doesn't trigger change detection.
    this.ngZone.runOutsideAngular(() => {
      // --- MutationObserver: track which group gains `show` ---
      this.mutationObserver = new MutationObserver((mutations) =>
        this.handleMutations(mutations)
      );

      this.mutationObserver.observe(this.el.nativeElement, {
        subtree: true,
        attributeFilter: ['class'],
        attributeOldValue: true,
      });

      // --- Click listener: clear active group on standalone top-level link click ---
      const host = this.el.nativeElement;
      const onClick = (event: Event) => this.onNavClick(event as MouseEvent);
      host.addEventListener('click', onClick);
      this.removeClickListener = () => host.removeEventListener('click', onClick);
    });
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    this.mutationObserver = null;
    this.removeClickListener?.();
    this.removeClickListener = null;
  }

  // ---------------------------------------------------------------------------
  // Core logic
  // ---------------------------------------------------------------------------

  /**
   * Processes DOM class mutations. We look for a top-level nav-group
   * gaining the `show` class (meaning CoreUI opened it or a route matched).
   * When found, we transfer `nav-group-active` to that group.
   */
  private handleMutations(mutations: MutationRecord[]): void {
    const topLevelGroups = this.getTopLevelNavGroups();

    for (const mutation of mutations) {
      const target = mutation.target as HTMLElement;

      // Only care about top-level c-sidebar-nav-group host elements
      if (!topLevelGroups.includes(target)) continue;

      const hadShow = (mutation.oldValue ?? '').split(/\s+/).includes('show');
      const hasShow = target.classList.contains('show');

      // A group just gained `show` — this is the new active group
      if (hasShow && !hadShow) {
        this.setActiveGroup(target);
        // Only one group can be opening at a time; stop processing this batch
        break;
      }
    }
  }

  /**
   * Fires on every click inside the sidebar nav (event delegation).
   *
   * Detects clicks on standalone top-level nav links — i.e., a `.nav-link`
   * that is NOT a `.nav-group-toggle` AND is NOT nested inside any
   * `c-sidebar-nav-group`. Example: the "Dashboard" item.
   *
   * When such a link is clicked, the active group (if any) should lose its
   * `nav-group-active` class because the user has explicitly left the group
   * context by navigating to an ungrouped page.
   */
  private onNavClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Find the closest nav-link that was clicked
    const link = target.closest('.nav-link') as HTMLElement | null;
    if (!link) return;

    // Ignore clicks on group toggles — those open/close groups
    if (link.classList.contains('nav-group-toggle')) return;

    // Check whether this link lives inside a nav-group.
    // If closest('c-sidebar-nav-group') returns null, it's a top-level standalone link.
    const parentGroup = link.closest('c-sidebar-nav-group') as HTMLElement | null;
    if (parentGroup !== null) return; // child item inside a group — do nothing

    // It's a top-level standalone link → clear the active group
    this.clearActiveGroup();
  }

  /**
   * Removes `nav-group-active` from the currently tracked active group
   * and resets the internal reference. Safe to call when no group is active.
   */
  private clearActiveGroup(): void {
    if (!this.activeGroup) return;

    this.mutationObserver?.disconnect();
    this.activeGroup.classList.remove('nav-group-active');
    this.activeGroup = null;
    this.mutationObserver?.observe(this.el.nativeElement, {
      subtree: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  }

  /**
   * Transfers the `nav-group-active` class to `newActive`,
   * removing it from any previously active group.
   * All manipulation is done via direct classList (outside Angular zone)
   * so Angular's HostBinding does not interfere.
   */
  private setActiveGroup(newActive: HTMLElement): void {
    // Pause observer to avoid re-entrant callbacks from our own changes
    this.mutationObserver?.disconnect();

    // Remove from previous active group if it's different
    if (this.activeGroup && this.activeGroup !== newActive) {
      this.activeGroup.classList.remove('nav-group-active');
    }

    // Set new active group
    this.activeGroup = newActive;
    newActive.classList.add('nav-group-active');

    // Reconnect observer
    this.mutationObserver?.observe(this.el.nativeElement, {
      subtree: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  /** Returns top-level `c-sidebar-nav-group` elements only (not nested ones). */
  private getTopLevelNavGroups(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll<HTMLElement>(
        ':scope > c-sidebar-nav-group'
      )
    );
  }
}
