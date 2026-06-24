# Service Promotion Management App

A static, role-based promotion management console for Prime Bridge Academy distribution operations.

## Roles

- **Super Admin** manages organizations, admins, distributors, service categories, approvals, and audit activity.
- **Admin** creates promotions, assigns distributors, monitors delivery, and exports reports.
- **Distributer** reviews assigned promotions, updates fulfillment status, and submits delivery notes.

The public authentication pages mirror the deployed Base44 surfaces:

- `login`
- `register`
- `forgot-password`

## Run Locally

Open `index.html` in a browser. No install step is required.

For local routing tests, you can also run:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Branches

Role branches are published as:

- `super-admin`
- `admin`
- `distributer`

`main` contains the complete integrated app with all role functionality.
