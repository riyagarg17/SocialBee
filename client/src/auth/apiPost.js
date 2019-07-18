export const createPost = (userId, token, post) => {
  return fetch(`${process.env.REACT_APP_API_URL}/addPost/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const getPosts = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/getPosts/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const likeUnlikePost = (userId, token, postId, type) => {
  //console.log("like unlike called",type);

  return fetch(`${process.env.REACT_APP_API_URL}/${type}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, postId })
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const singlePost = (postId, token) => {
  //console.log("single post called");
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const addComment = (userId, token, postId, comment) => {
  return fetch(`${process.env.REACT_APP_API_URL}/comment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, postId, comment })
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const deleteComment = (userId, token, postId, comment) => {
  return fetch(`${process.env.REACT_APP_API_URL}/uncomment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, postId, comment })
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

export const getPostByUser = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/postsby/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const remove = (postId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const update = (postId, token, post) => {
  //console.log(postId, token, post);
  return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: post
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
