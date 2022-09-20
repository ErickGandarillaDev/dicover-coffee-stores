import  Head  from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'

import coffeeStoresData from '../../data/coffee-stores.json';

import styles from '../../styles/coffee-store.module.css'

import cls from 'classnames'

import useSWR from 'swr';

import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../store/store-context';
import { IsEmpty } from '../../utils';

export async function getStaticProps({params}:any){

  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find((coffeeStore:any) => {
    return coffeeStore.fsq_id === params.id
  })

  return{
    props:{
      cofeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
    }
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore:any) =>{
    return{
      params:{
        id:coffeeStore.fsq_id.toString(),
      },
    }
  });
  return{
    paths,
    fallback:true
  }
}

const CoffeeStore = ({cofeeStore}:any) => {
  const router = useRouter();
  
  
  const [finalCoffeeStore,setFinalCoffeeStore] = useState(cofeeStore)
  
  const id = router.query.id;

  
  const {
    state: {
      coffeeStores
    }
  } = useContext(StoreContext)
  
  const handleCreateCoffeeStore = async ( coffeeStore:any) => {
    try{
      const {fsq_id:id, name, imgUrl } = coffeeStore 
      fetch('/api/createCoffeeStore',{
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(
          {
            id,
            name,
            voting : 0,
            imgUrl
          }
        ),
      })
    } catch(error:any) {
      console.error('Error creating coffee store', error)
    }
  }
  useEffect(()=>{
      if(IsEmpty(cofeeStore)){
        if(coffeeStores.length > 0){
          const findCoffeeStoreById = coffeeStores.find((coffeeStore:any) => {
            return coffeeStore.fsq_id === id
          });
          if(findCoffeeStoreById){
            setFinalCoffeeStore(findCoffeeStoreById)
            handleCreateCoffeeStore(findCoffeeStoreById)
          }
        } 
      } else {
        handleCreateCoffeeStore(cofeeStore)
      }
  },[id, cofeeStore])
  
  const [votingCount,setVotingCount] = useState<number>(0);


  const fetcher = (url:any) => fetch(url).then((res)=> res.json());
  const {data,error} = useSWR(`/api/getCoffeeStoreById?id=${id}`,fetcher)

  useEffect(() =>{
    if(data && data.length > 0 ){
      setFinalCoffeeStore(data[0]);
      setVotingCount(data[0].voting)
    }
  },[data])

  if(error) (<div>Error getting the data</div>)

  if(router.isFallback) {return <div>Loading...</div>}
  
  const handleUpvoteButton = async () =>{
    try{
      const response = await fetch('/api/upVoteCoffeeStoreById',{
        method: "PUT",
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(
          {
            id,
          }
        ),
      })
      const newVotingCount = await response.json(); 
      if(newVotingCount && newVotingCount.length >0 ){
        let count = votingCount + +1;
        setVotingCount(count); 
      }
    } catch(error:any) {
      console.error('Error upvoting the coffee store', error)
    }
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{finalCoffeeStore?.name || ""}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/' >
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{finalCoffeeStore?.name || ""}</h1>
          </div>
          <Image src={finalCoffeeStore?.imgUrl  || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} width={600} height={360} className={styles.storeImg} alt={finalCoffeeStore?.name || ""}/>
        </div>

        <div className={cls("glass",styles.col2)}>
          {/* {
            location.address && 
              <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width="24" height="24"/>
              <p className={styles.text}>{location.address}</p>
            </div>
          }
          {
            location.neighborhood && location.neighborhood.length > 0 && 
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24"/>
              <p className={styles.text}>{location.neighborhood[0]}</p>
            </div>
          } */}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24"/>
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up vote!</button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore;
