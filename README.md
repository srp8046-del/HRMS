# HRMS — Leeway International

A clean, fresh Human Resource Management System for Leeway International.

## Foundation
- Supabase Auth with username/password login
- Role-based access: Admin, Manager, Team Leader, Tele Sales Executive, MIS/Viewer, Uploader
- Employee Master and reporting hierarchy
- BIO attendance
- TOS attendance
- Final attendance calculation
- Attendance calendar
- CSV data ingestion and validation
- MIS dashboards and reports
- Row Level Security (RLS)
- Responsive desktop/mobile UI
- GitHub Pages compatible static frontend

## Access model
- **Admin:** organization-wide access and administration
- **Manager:** own attendance + reporting hierarchy
- **Team Leader:** own attendance + direct team
- **Tele Sales Executive:** own attendance only
- **MIS / Viewer:** organization-wide view without upload
- **Uploader:** organization-wide view with upload permission

## Attendance rules
BIO status:
- Missing IN or OUT → NP
- Less than 4 hours → A
- More than 60 minutes late → HD
- 0–60 minutes late with sufficient work → LC
- 8+ hours → P

TOS effective time:
`LOGIN − LUNCH − TEA − TRAINING`

- < 4:00 → A
- 4:00–6:59 → HD
- 7:00–7:59 → LC
- 8:00+ → P

For Tele Sales Executives, final status is the worse of BIO and TOS. Other designations use BIO.

## Security
No service-role key is used in browser code. Database authorization is enforced with Supabase RLS. Passwords are handled by Supabase Auth and are never stored in GitHub CSV files.
