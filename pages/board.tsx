import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";

interface ApiResponseItem {
  id: number;
  name: string;
  date: string;
  description: string;
}

const Board: React.FC = () => {
  const [posts, setPosts] = useState<ApiResponseItem[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/posts')
      .then(response => response.json())
      .then((data: ApiResponseItem[]) => setPosts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleName: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.trim().length > 100) {
      setErrorMessages(['名前は１００文字までです。']);
      return;
    }

    setName(e.target.value.trim());
  };

  const handleDescription: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.target.value.trim().length > 280) {
      setErrorMessages(['投稿内容は２８０文字までです。']);
      return;
    }

    setDescription(e.target.value.trim());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setErrorMessages([]);

    if (!name.trim() || !description.trim()) {
      if (!name.trim()) {
        setErrorMessages(errorMessages => [...errorMessages, '名前が空欄です。']);
      }
      if (!description.trim()) {
        setErrorMessages(errorMessages => [...errorMessages, '投稿内容が空欄です。']);
      }

      return;
    }

    const url = 'http://localhost:8000/api/posts';
    const params = {
      method : "POST",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({name : name, description : description})
    };
    const response = await fetch(url, params);
    const newPost = await response.json();

    if (newPost.status) {
      setPosts(oldPosts => [...oldPosts, newPost.data]);
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="mt-3 text-center">
      <h1 className="text-2xl">一言掲示板</h1>
      <ul className="max-w-lg mx-auto mt-3 text-left text-red-400">
        {errorMessages.map((errorMessage, $i) => (
          <li key={$i}>{errorMessage}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-3 text-left">
        <label htmlFor="name">名前</label>
        <br />
        <input
          type="text"
          id="name"
          value={name}
          className="w-64 bg-gray-300 rounded"
          onChange={handleName}
        />
        <br />
        <label htmlFor="description">投稿内容</label>
        <br />
        <textarea
          id="description"
          value={description} 
          className="w-64 h-32 resize-none bg-gray-300 rounded"
          onChange={handleDescription}
        ></textarea>
        <br />
        <button type="submit" className="p-2 bg-blue-300 rounded">投稿</button>
      </form>
      {posts.length > 0 ? (
        <div className="max-w-lg mx-auto text-left">
          {posts.map((post) => (
            <div key={post.id} className="py-3 border-b-2 break-all">
              <div className="flex justify-between items-baseline">
                <span className="max-w-xs px-3 pb-3 text-lg  break-all">{post.name}</span>
                <span className="px-3 pb-3 text-md">{post.date}</span>
              </div>
              <p className="px-3">{post.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading Data...</p>
      )}
    </div>
  );
}; 

export default Board;
