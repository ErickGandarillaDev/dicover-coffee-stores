import { createContext, Dispatch, Reducer, useReducer } from "react";

const initialState = {
    latLong: "",
    coffeeStores: []   
  }
  
  interface initialStateType {
    latLong: string,
    coffeeStores: never[]
  } 
  
  
   export const ACTION_TYPES = {
    SET_LAT_LONG: 'SET_LAT_LONG',
    SET_COFFEE_STORES: 'SET_COFFEE_STORES'
  }
  
  export const StoreContext = createContext<{state:initialStateType,dispatch:Dispatch<any>}>({state:initialState,dispatch: ()=>null});
  interface ACTION_TYPES_INT {
    SET_LAT_LONG:'SET_LAT_LONG',
    SET_COFFEE_STORES: 'SET_COFFEE_STORES'
  }
  
  const storeReducer: Reducer<initialStateType,any> = (state:any,action:any) =>{
    switch(action.type){
      case ACTION_TYPES.SET_LAT_LONG: {
        return {...state,latLong: action.payload.latLong}
  
      }
      case ACTION_TYPES.SET_COFFEE_STORES: {
        return {...state,coffeeStores: action.payload.coffeeStores}
      }
      default:
        throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
  
  const StoreProvider = ({children}:any) => {
    const [state,dispatch] = useReducer(storeReducer,initialState)
  
    return(
      <StoreContext.Provider value={{state,dispatch}}>
        {children}
      </StoreContext.Provider>
    )
  }
  
  export default StoreProvider;