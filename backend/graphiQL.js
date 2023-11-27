/* // Query to get all projects in the DB 
{
   projects{
     name
     status
     client{
       name,
       email
     }
   }
 } */

/* 
//  Query to get particular project in the DB
{
   project(id: "1"){
     name
     status
     client{
       name,
       email
     }
   }
 } */

/* //  Query to retrieve all client
{
   clients{
     name,
     email
   }
} */

/* // Query to retrieve particular client
{
   client(id: "2"){
     phone,
     email
   }
} */

/* // Adding client data
mutation{
   addClient(name: "Bruce Banner",
       email: "bruce@gmail.com",
       phone: "321-468-8887"){
     name
     phone
   }
 } */

//  Addng Project
// mutation{
//   addProject(name: "test2",
//     description: "This is another description",
//     status: completed,
//     clientId: "6503c28cd350e89bedb7896b"
//   ) {
//     id
//   }
// }
