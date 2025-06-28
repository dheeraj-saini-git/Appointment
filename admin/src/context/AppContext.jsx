import {createContext} from "react" ;

export const AppContext = createContext()

export default function AppContextProvider(props){

    const currency = '$' 

    const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate)=>{
        const date = slotDate.split('_')
        let formatedDate = date[0]+' '+months[date[1]]+' '+date[2]
        return formatedDate
  }
    const calculateAge = (dob)=>{
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    
    const value = { calculateAge, slotDateFormat, currency }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}