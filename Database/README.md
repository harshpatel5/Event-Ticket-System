# Event Ticketing System Database

A MySQL database project designed for managing event tickets, including events, venues, and customer purchases.

## Project Description

This is a student database project that simulates an event ticketing system, similar to Ticketmaster or EventBrite. The system allows tracking of events, ticket sales, and customer purchases.

## Database Structure

The system consists of 7 main tables:

1. **CATEGORY** - Stores event types (Concert, Sports, Theater, etc.)
2. **VENUE** - Manages venue details and capacity
3. **EVENT** - Contains event information and ticket availability
4. **TICKET** - Handles different ticket types and prices
5. **CUSTOMER** - Stores customer information
6. **PURCHASE** - Tracks customer purchases
7. **PURCHASE_TICKET** - Links tickets to purchases

## Files Included

- `tables.sql` - Contains all table creation queries
- `sampledata.sql` - Contains sample data for testing

## How to Use

1. Create a new MySQL database
2. Run `tables.sql` to create the tables
3. Run `sampledata.sql` to add sample data

## Features

- Multiple event categories and venues
- Different ticket types with varying prices
- Customer purchase tracking
- Payment status monitoring
- Ticket availability tracking

## Sample Data Includes

- Various events (concerts, sports, theater)
- Multiple venues with different capacities
- Sample customers and purchases
- Different ticket types and prices