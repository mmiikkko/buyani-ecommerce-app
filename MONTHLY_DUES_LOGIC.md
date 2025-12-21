# Monthly Dues Business Logic

## Overview
When a seller's shop is approved, they pay for the first month upfront. Monthly billing starts 1 month after shop approval.

**IMPORTANT**: The monthly dues system is **admin-managed**. Sellers can view their billing history, but admins control payment verification and billing updates.

## Admin Responsibilities

### 1. Payment Verification
- Admins verify seller payments (receipts uploaded by sellers)
- Admins mark payment method (Cash or GCash)
- Admins approve or reject payment submissions

### 2. Monthly Rent Management
- Admins can update the monthly rent amount for sellers
- Changes apply to future billing periods

### 3. Billing Cycle Management
- When a pending payment is verified and marked as "paid", the system automatically generates the next month's billing
- Ensures continuous billing cycle

### 4. Manual Notifications
- Admins can manually send payment reminder notifications to sellers
- Notification appears as an overlay/dialog on seller's dashboard
- Useful for urgent reminders or custom messages about upcoming rent

## Billing Records Structure

### Initial Setup (When Shop is Approved)
When a shop application is approved, TWO billing records are created:

1. **First Month Payment (Already Paid)**
   - `billingMonth`: Month of shop approval (e.g., "2025-01")
   - `status`: "paid"
   - `dueDate`: Shop approval date
   - `amountDue`: Monthly rent amount
   - Has a corresponding `tenantPayments` record with payment method (Cash/GCash)

2. **Second Month Payment (Pending)**
   - `billingMonth`: Next month after approval (e.g., "2025-02")
   - `status`: "pending"
   - `dueDate`: 1 month after shop approval date
   - `amountDue`: Monthly rent amount
   - No payment record yet (waiting for seller to pay)

## Payment Workflow

1. **Seller uploads receipt** via Monthly Rent page
2. **Admin reviews** the payment in admin panel
3. **Admin verifies**:
   - Payment method (Cash or GCash)
   - Amount matches billing
   - Receipt is valid
4. **Admin approves** → Status changes to "paid"
5. **System auto-generates** next month's billing (status: "pending")

## Example Timeline

**Shop Approved**: January 15, 2025

### Billing Records Created:
1. **January 2025** (First Month)
   - Status: `paid`
   - Due Date: January 15, 2025
   - Amount: ₱500.00
   - Payment Method: Cash (set by admin)
   - Payment Record: Yes (initial payment)

2. **February 2025** (Second Month)
   - Status: `pending`
   - Due Date: February 15, 2025
   - Amount: ₱500.00
   - Payment Record: No (awaiting payment)

3. **When February payment is verified** → March 2025 billing auto-generated

## Notification System
- Sellers receive notifications 5 days before the due date
- Notifications appear in seller dashboard
- Example: For February 15 due date, notification appears on February 10

## User Roles

### Sellers Can:
- View billing history
- Upload payment receipts
- See payment status
- Receive due date notifications

### Admins Can:
- Verify payments
- Set payment method (Cash/GCash)
- Update monthly rent amounts
- Approve/reject payment submissions
- Manage billing cycles
