export const fetchUserProfile=(userId,token)=>{

    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`,{
        method:"GET",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(response=>response.json())
    .catch(err=>console.log(err));
};

export const editUser=(user,token)=>{

    //console.log("edit user called",user);

    return fetch(`${process.env.REACT_APP_API_URL}/user/${user._id}`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .catch(err => console.log(err));
    
};

export const deleteUser=(userId,token)=>{

    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
    })
        .then(response => response.json())
        .catch(err => console.log(err));
    
};

export const searchUser=(value,token)=>{
    //console.log(value);
    return fetch (`${process.env.REACT_APP_API_URL}/users/${value}`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
            
        },
        //body: JSON.stringify(value)
    })
        .then(response => response.json())
        .catch(err => console.log(err));
};

export const uploadImage=(userId,image,token)=>{

    //console.log(image.name);
    return fetch (`${process.env.REACT_APP_API_URL}/image/${userId}`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
            
       },
        body: image
    })
        .then(response => response.json())
        .catch(err => console.log(err));
};

export const updateLocalStorage=(user,next)=>{

    //console.log("data received in updateLocalStorage",user);
    if(typeof window=="undefined"){
        return false;
    }
    if(localStorage.getItem("token")){
        let userData= JSON.parse(localStorage.getItem("token"));
        //console.log("local storage data",userData);
        userData.user=user;
        //console.log("data received in updateLocalStorage",userData);
        localStorage.setItem('token',JSON.stringify(userData));
    }
    next();
};

export const followUser=(userId,token,followId,type)=>{

    //console.log("follow user called",userId,followId,type);

    return fetch(`${process.env.REACT_APP_API_URL}/user/${type}`, {
        method: "PUT",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId,followId})
    })
        .then(response => response.json())
        .catch(err => console.log(err));
    
};