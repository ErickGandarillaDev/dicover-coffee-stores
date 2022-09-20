export const IsEmpty =(obj:any) =>{ 
    if(obj === undefined) return true
    return Object.keys(obj).length===0
}