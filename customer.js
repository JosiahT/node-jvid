
async function sendTopMoviesToCustomer(id){
  try{
    const customer = await getCustomer(id);
    console.log('customer: ', customer);
    if(customer.isGold){
      const movies = await getTopMovies();
      console.log('Top movies: ', movies);
      await sendEmail(customer.email, movies);
      console.log("email sent...");
    }
  }
  catch(err){
    console.log("Error", err);
  }
}

sendTopMoviesToCustomer(1);
/*
getCustomer(1, (customer) => {
  console.log('Customer: ', customer);
  if (customer.isGold) {
    getTopMovies((movies) => {
      console.log('Top movies: ', movies);
      sendEmail(customer.email, movies, () => {
        console.log('Email sent...')
      });
    });
  }
});
*/
function getCustomer(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        id: id, 
        name: 'Mosh Hamedani', 
        isGold: true, 
        email: 'email' 
      });
    }, 1000);
  })    
}

function getTopMovies() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(['movie1', 'movie2']);
    }, 1000);
  });
}

function sendEmail(email, movies) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}