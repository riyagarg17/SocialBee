export const signupUser=(user)=> {

    //console.log(user);
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => console.log(err));
};

export const loginUser=(user)=> {

    return fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
            
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => console.log(err));
};

export const signout=(next)=>{
    if(typeof window!=="undefined"){
        localStorage.removeItem("token");
        next();
        return fetch(`${process.env.REACT_APP_API_URL}/logout`,{
            method:"GET"
        })
        .then(response=>response.json())
        .catch(err=>console.log(err));
    }
};

export const isAuthenticated=()=>{
    if(typeof window=="undefined"){
        return false;
    }
    if(localStorage.getItem("token")){
        return JSON.parse(localStorage.getItem("token"));
    }
    else
        return false;
};

export const hasAutherization=(id)=>{

    return (isAuthenticated().user && isAuthenticated().user._id === id);
};

