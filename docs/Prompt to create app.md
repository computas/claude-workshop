# Task

Create an example application for a Lego shopping website, written in react for the front end and js full stack for the backend. The datbase shall be a text file or a SQL lite in-memory database, initialized by from file placed in a directory when the application starts (this is done this way only because the application is an example).

**The application is meant as a an example for a course, so certain parts will not implemented for real, as described below.**


# Runtime environemnt

The application shall run locally only via vite and local startup of the backend as needed, since it's only  an example.

# Application specification

The application shall allow to manage a product catalog via an admin-only section, and present customers with a shopping process which includes:

 - viewing, filtering and selecting products
 - add them to a shopping cart
 - checkout and payment, where the user specifies shipping addressa and invocing address
 - no login is supported, as this is a simplified application to be used as an example
 - it should be possible to switch lanaguage of the interface, with Norwegian, English, Italian as available options. 
 The default language should depend on the browser location, and fall back to English if the location or the language 
 are not available.
 -  in the admin page, it should be possible to mark order as received, confirmed, canceled, shipped, delivered, awaiting return and returned. 
   Orders can be canceled only until they are not shipped.
   It shall be possbile to filter orders by state.
 - For canceled and returned orders, it should be possible to refund money (via the mocked payment system)
 
- The payment process will be simulated and do not require any real link to any payment system.
- Logs should be generated for the backend in a dedicated directory. Create separate logs for technical 
  events (http calls, program startup etc), business events (order creation, status changed etc for each order)
- in the admin page:
    - add a section to be able to see the logs for an order, optionally combining the technical log with t
  specific order log
    - add a button to directly open the logs directory in the operating system

# Example Data

Please generate a set of 50 sample products (imaginary or real lego sets, whatever is simpler to find) with prices from 100NOK to 3000NOK, generating images and descriptions accordingy and storing them in a database.