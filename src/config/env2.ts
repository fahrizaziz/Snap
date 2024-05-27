/* eslint-disable prettier/prettier */
export default () => ({  
    db2 : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      name: process.env.DB_NAME2,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    }
  });