# Task

Create an example application for a shopping website, written in react for the front end and js full stack for the backend. The datbase shall be a text file or a SQL lite in-memory database, initialized by from file placed in a directory when the application starts (this is done this way only because the application is an example).

**The application is meant as a an example for a course, so certain parts will not implemented for real, as described below.**


# Runtime environemnt

The application shall run locally only via vite and local startup of the backend as needed, since it's only  an example.

# Application specification

The application shall allow to manage a product catalog via an admin-only section, and present customers with a shopping process which includes:

 - viewing, filtering and selecting products
 - add them to a shopping cart
 - checkout and payment, where the user specifies shipping addressa and invocing address
 - no login is supported, as this is a simplified application to be used as an example
 
The payment process will be simulated and do not require any real link to any payment system.
Logs should be generated for the backend in a dedicated directory 

# Example Data

Please generate a set of 50 sample products (for example fantasy lego sets) with prices from 100NOK to 3000NOK, generating images and descriptions accordingy and storing them in a database.