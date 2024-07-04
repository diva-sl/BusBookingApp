import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.users.user); // Adjust based on your state structure

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Home
      {user.email && <h1>{user.email}</h1>}
    </div>
  );
}

export default Home;
