import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNPLASH_ACCESS_KEY || ''
});


const getUrlForCoffeeStores = (latLong:string, query:string, limit:string) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    perPage:40,
  });

  const unplashResults = photos.response?.results;

  return unplashResults !== undefined && unplashResults.map((results:any) => results.urls["small"]) || [];
    
}
export const fetchCoffeeStores = async (latLong = "25.683457936372918,-100.31408572309117", limit="6") => {
  
  const photos = await getListOfCoffeeStoresPhotos()

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_AUTH_KEY || ''
    }
  };

  const response =  await fetch(getUrlForCoffeeStores(latLong,"cafe",limit), options);

  const data = await response.json();
    
  return data.results.map((result:any,index:number)=>{
    return{
      ...result,
      imgUrl: photos[index]
    }
  });

}