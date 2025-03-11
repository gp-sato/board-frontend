import { useEffect, useState } from "react";

interface ApiResponseItem {
  id: number;
  name: string;
  date: string;
  description: string;
}

const ApiTest: React.FC = () => {
  const [data, setData] = useState<ApiResponseItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/posts')
      .then(response => response.json())
      .then((data: ApiResponseItem[]) => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="mt-3 text-center">
      <h1 className="text-2xl">一言掲示板</h1>
      {data.length > 0 ? (
        <div className="max-w-lg mx-auto text-left">
          {data.map((item) => (
            <div key={item.id} className="py-3 border-b-2">
              <div className="flex justify-between items-baseline">
                <span className="px-3 pb-3 text-lg">{item.name}</span>
                <span className="px-3 pb-3 text-md">{item.date}</span>
              </div>
              <p className="px-3">{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading Data...</p>
      )}
    </div>
  );
}; 

export default ApiTest;
