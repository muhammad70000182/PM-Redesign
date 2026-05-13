# Copilot Instructions for PM Redesign

## Project Overview

**PM Redesign** is an Angular 16+ admin dashboard application built with CoreUI framework for managing project/product agreements, approvals, and administrative operations. It serves as a business management system with role-based access control and API-driven data flow.

**Tech Stack:**
- Angular 16.2.3, TypeScript (ES2022), SCSS
- CoreUI 4.5 (admin UI components)
- RxJS observables, JWT authentication
- DataTables, ngx-toastr (notifications), ngx-translate (i18n)
- Backend: .NET API (~port 7004), separate reporting service (~port 44374)

## Architecture Pattern: Lazy-Loaded Feature Modules

The app uses **lazy-loaded feature modules** keyed by route. Each major feature (agreements, approvals, users, master-data, etc.) has its own module with dedicated routing.

**Key structure:**
```
src/app/
├── app.module.ts                    # Root module with CoreUI, routing setup
├── app-routing.module.ts            # Lazy-load routes; AuthGuard on children
├── login/                           # Pre-route auth (no lazy load)
├── [feature-module]/
│   ├── [module]-routing.module.ts   # Feature routes, child guards
│   ├── [module].module.ts           # declarations, imports, guards
│   ├── [feature]/                   # Main feature component + children
│   └── *.component.ts               # Component hierarchy
├── _services/                       # Shared services (auth, HTTP, config)
├── _Helper/                         # Utilities (validators, guards, pipes)
├── _pipes/                          # Custom pipes (date formatting, decimals)
└── shared-module/                   # SharedCustomModule (imports for all features)
```

**Lazy-loading pattern:** Routes use `loadChildren` with dynamic imports. Each feature module must export itself and register its routing module with `RouterModule.forChild()`.

## Critical Services & Dependency Injection

**Core Services (providedIn: 'root'):**

| Service | Purpose | Key Note |
|---------|---------|----------|
| `AuthService` | JWT validation, login state | Uses `@auth0/angular-jwt` |
| `ConfigService` | Loads `assets/config.json` (API URLs) at app init | See `APP_INITIALIZER` in app.module |
| `SharedService` | Generic HTTP wrapper (Get, Post, PostThirdParty) | Prepends `apiUrl` from config |
| `PermissionsSharingService` | Role-based permission checks | Works with `PermissionsGuard` |
| `LoadingService` | Global loader state management | Used with `AuthInterceptor` |

**HTTP Interceptors:**
- `AuthInterceptor` (loader): Adds auth headers, shows/hides loader
- `JwtInterceptor`: Token refresh/expiry handling

**Guards:**
- `AuthGuard`: Checks `isAuthenticated()`, redirects to login
- `PermissionsGuard`: Feature-level permission validation (url-based)

## API Configuration & Environment

**Config loading flow:**
1. `main.ts` → `ConfigService.loadConfig()` via `APP_INITIALIZER`
2. Loads `src/assets/config.json` with `apiUrl`, `baseUrl`, `rptURL`
3. Example (local dev): `"apiUrl": "http://localhost:7004/api"`
4. **All HTTP calls** go through `SharedService` which auto-prepends `apiUrl`

**External APIs:**
- Main backend: `{apiUrl}` (agreements, users, approvals)
- Reporting service: `{rptURL}` (separate .NET service for reports)

## Code Patterns & Naming Conventions

**Component Naming:** PascalCase classes, kebab-case selectors
```typescript
// agreement-listing.component.ts
export class AgreementListingComponent { }
// Used as: <app-agreement-listing></app-agreement-listing>
```

**Module Structure:** Each feature has `[feature].module.ts` + `[feature]-routing.module.ts`
- Declare all components in module's `declarations` array
- Import `SharedCustomModule` for common directives/pipes
- Import `PermissionsSharingService`, `PermissionsGuard` for route protection

**Forms:** ReactiveFormsModule used; custom validators in `_services/custom-validators.service.ts`
- Example: `no-space-validator.service.ts`, `InputFieldValidator.ts`

**Pipes:** Custom pipes in `_pipes/` (date-formate, decimel-point, comma-seperated service)
- Apply consistently: `{{ value | dateFormate }}`, `{{ value | decimelPoint }}`

## Build & Test Commands

```bash
npm start              # Dev server on :4400 with hot reload
npm run build          # Production build → dist/web-app/
npm run watch          # Dev build with watch (no serve)
npm test               # Run tests via Karma + Jasmine (Chrome)
```

**Testing:** Spec files use Jasmine (`.spec.ts`). Karma configuration in `karma.conf.js`.

## Common Workflow for New Features

1. **Create feature module** in `src/app/[feature]/`:
   - `[feature].module.ts` (declare components, import `SharedCustomModule` + services)
   - `[feature]-routing.module.ts` (use `forChild()`, add `canActivate: [AuthGuard]`)
   - Add route to `app-routing.module.ts` with `loadChildren`

2. **Add HTTP calls** via `SharedService.Get()` or `.Post()`
   - Don't construct full URLs; pass endpoint path only
   - Subscribe to observables or use `async` pipe in templates

3. **Add role guards** using `PermissionsGuard` on routes
   - Service checks user permissions; redirects if denied

4. **Use CoreUI components** (CardModule, FormModule, GridModule, etc.)
   - Already imported in root; available to all lazy-loaded modules

## Known Gotchas & Constraints

- **No `strictPropertyInitialization`** in tsconfig (disabled for flexibility)
- **Third-party APIs:** Use `PostThirdParty()` for non-ABACUS APIs; `Post()` auto-prepends config URL
- **i18n:** ngx-translate loaded; keys stored in `src/assets/i18n/`
- **DataTables integration:** Scripts loaded via `angular.json`; use `angular-datatables` package
- **Permissions:** Tied to JWT token; decoding happens in `AuthService` + `PermissionsSharingService`

## File Reference Guide

| File | Purpose |
|------|---------|
| [src/app/app.module.ts](../src/app/app.module.ts) | Core module, APP_INITIALIZER setup |
| [src/app/_services/shared.service.ts](../src/app/_services/shared.service.ts) | HTTP wrapper, API base |
| [src/app/_services/auth.service.ts](../src/app/_services/auth.service.ts) | JWT validation, auth state |
| [src/app/_services/LoadConfigFile.ts](../src/app/_services/LoadConfigFile.ts) | Config loader |
| [src/assets/config.json](../src/assets/config.json) | API endpoint URLs |
| [src/app/agreements/agreements.module.ts](../src/app/agreements/agreements.module.ts) | Example feature module |
