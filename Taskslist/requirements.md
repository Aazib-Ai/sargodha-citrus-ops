# Requirements Document

## Introduction

Sargodha Citrus Ops is an internal operations dashboard (PWA) for a 3-partner orange-selling business in Pakistan. The system tracks partner capital contributions, expenses, orders, and provides financial analytics to ensure total transparency and prevent disputes during a 2-month seasonal operation (Jan-Feb). Built with Next.js 14, Supabase (Postgres DB + Auth), Cloudflare R2 (image storage), and Shadcn/UI.

**Key Business Rules:**
- No initial capital pool—partners contribute ad-hoc as expenses arise
- Profit is split equally (33.33% each) regardless of contribution amount
- Partners who contributed more get reimbursed from the pool before profit split
- Two product variants: 10kg box and 5kg box with different pricing

## Glossary

- **Partner**: One of the 3 business co-owners who can inject capital and record expenses
- **Capital Contribution**: Cash injected by a partner into the business pool
- **Expense**: Money spent from a partner's pocket for business purposes (counts as capital contribution)
- **Transaction**: Any financial movement (capital injection or expense)
- **Order**: A customer purchase of a 10kg orange box
- **Net Margin**: Sell Price minus Fixed Cost per order
- **Fixed Cost (10kg)**: The base cost of a 10kg orange box (1720 PKR)
- **Fixed Cost (5kg)**: The base cost of a 5kg orange box (860 PKR)
- **Sell Price (10kg)**: The price charged for 10kg box (default 3250 PKR)
- **Sell Price (5kg)**: The price charged for 5kg box (default 1750 PKR)
- **Product Variant**: Either 10kg box or 5kg box
- **Journal Entry**: A timestamped note or photo for operational documentation
- **Common Pool**: Total capital contributed by all partners combined
- **Profit**: Total Revenue minus Total Fixed Costs minus Total Expenses
- **Partner Payout**: Contribution reimbursement plus equal profit share (Profit ÷ 3)

## Requirements

### Requirement 1: Partner Authentication

**User Story:** As a partner, I want to securely log into the dashboard, so that only authorized team members can access financial data.

#### Acceptance Criteria

1. WHEN a user attempts to access the dashboard without authentication THEN the System SHALL redirect the user to the login page
2. WHEN a partner enters valid credentials THEN the System SHALL authenticate the user and grant access to the dashboard
3. WHEN a partner enters invalid credentials THEN the System SHALL display an error message and deny access
4. WHEN a partner logs out THEN the System SHALL terminate the session and redirect to the login page
5. WHERE partner invitations are required THEN the System SHALL restrict registration to invited email addresses only

### Requirement 2: Partner Ledger Management

**User Story:** As a partner, I want to track capital contributions and expenses for each partner, so that we have complete transparency on who contributed what.

#### Acceptance Criteria

1. WHEN a partner records a capital injection THEN the System SHALL add the amount to that partner's total contribution and the common pool
2. WHEN a partner records an expense THEN the System SHALL add the amount to that partner's total contribution (as capital) and log the expense details
3. WHEN viewing the partner ledger THEN the System SHALL display each partner's total capital contribution, total expenses paid, and percentage of common pool
4. WHEN a transaction is recorded THEN the System SHALL associate the transaction with the partner who created it
5. WHEN viewing partner details THEN the System SHALL display a breakdown of all capital injections and expenses for that partner

### Requirement 3: Transaction Logging

**User Story:** As a partner, I want to log all financial transactions with categories and receipts, so that we have an auditable record of all money movement.

#### Acceptance Criteria

1. WHEN a partner creates a transaction THEN the System SHALL require amount, category, and description fields
2. WHEN a partner selects a category THEN the System SHALL offer options: Marketing, Packaging, Fruit Stock, Logistics, Food/Misc, Capital Injection
3. WHEN a partner uploads a receipt image THEN the System SHALL store the image in Cloudflare R2 storage and link it to the transaction
4. WHEN viewing the transaction log THEN the System SHALL display transactions in reverse chronological order with date, amount, category, partner name, and receipt indicator
5. WHEN a partner clicks on a transaction THEN the System SHALL display full details including receipt image if available
6. WHEN filtering transactions THEN the System SHALL allow filtering by category, partner, and date range

### Requirement 4: Order Tracking

**User Story:** As a partner, I want to track order status and calculate margins, so that we know our sales performance and profitability per order.

#### Acceptance Criteria

1. WHEN a partner creates an order THEN the System SHALL require customer name, product variant (10kg or 5kg), quantity, and sell price fields
2. WHEN an order is created with 10kg variant THEN the System SHALL calculate Net Margin as (Sell Price - 1720) multiplied by quantity
3. WHEN an order is created with 5kg variant THEN the System SHALL calculate Net Margin as (Sell Price - 860) multiplied by quantity
3. WHEN viewing an order THEN the System SHALL display status, customer name, quantity, sell price, and calculated net margin
4. WHEN a partner updates order status THEN the System SHALL allow transitions: Pending to Shipped, Shipped to Delivered, Shipped to Returned
5. WHEN an order status changes THEN the System SHALL record the timestamp of the status change
6. WHEN viewing the order list THEN the System SHALL display orders with current status, customer name, and net margin

### Requirement 5: Journal Documentation

**User Story:** As a partner, I want to post notes and photos in a timeline, so that we can document operational observations for end-of-season review.

#### Acceptance Criteria

1. WHEN a partner creates a journal entry THEN the System SHALL require at least text content or an image
2. WHEN a partner uploads a journal image THEN the System SHALL store the image in Cloudflare R2 storage and display it in the entry
3. WHEN viewing the journal THEN the System SHALL display entries in reverse chronological order as a timeline
4. WHEN viewing a journal entry THEN the System SHALL display the author's name, timestamp, text content, and any attached images
5. WHEN a partner creates a journal entry THEN the System SHALL automatically record the creation timestamp and author

### Requirement 6: Analytics Dashboard

**User Story:** As a partner, I want to see real-time financial analytics, so that we can monitor business health and make informed decisions.

#### Acceptance Criteria

1. WHEN viewing the analytics dashboard THEN the System SHALL display Total Revenue from delivered orders
2. WHEN viewing the analytics dashboard THEN the System SHALL display Total Expenses across all categories
3. WHEN viewing the analytics dashboard THEN the System SHALL calculate and display Profit/Loss as Total Revenue minus Total Expenses minus Total Fixed Costs
4. WHEN viewing the analytics dashboard THEN the System SHALL calculate ROI as (Profit divided by Total Capital Contributed) multiplied by 100
5. WHEN viewing the analytics dashboard THEN the System SHALL calculate Return Rate as (Returned Orders divided by Total Orders) multiplied by 100
6. WHEN viewing the analytics dashboard THEN the System SHALL display Profit as (Total Revenue from delivered orders minus Total Fixed Costs minus Total Expenses)
7. WHEN viewing the analytics dashboard THEN the System SHALL display each partner's equal profit share (Profit divided by 3)
8. WHEN viewing the analytics dashboard THEN the System SHALL display each partner's total payout as (their contribution reimbursement plus their equal profit share)
9. WHEN data changes occur THEN the System SHALL update analytics values in real-time

### Requirement 7: Data Integrity and Audit Trail

**User Story:** As a partner, I want all financial data to be immutable and traceable, so that we can trust the records and resolve any disputes.

#### Acceptance Criteria

1. WHEN a transaction is created THEN the System SHALL record the creating partner and timestamp permanently
2. WHEN viewing any financial record THEN the System SHALL display who created it and when
3. WHEN a partner attempts to delete a transaction THEN the System SHALL prevent deletion and maintain the record
4. WHEN an order status changes THEN the System SHALL maintain a history of all status transitions with timestamps

### Requirement 8: Progressive Web App

**User Story:** As a partner, I want to access the dashboard on mobile devices, so that I can log transactions and check status while in the field.

#### Acceptance Criteria

1. WHEN the app is accessed on a mobile device THEN the System SHALL render a responsive mobile-friendly interface
2. WHEN a partner installs the PWA THEN the System SHALL provide an installable app experience with home screen icon
3. WHEN the app loads THEN the System SHALL display within 3 seconds on a 3G connection
