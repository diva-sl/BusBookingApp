import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state) => state.users);
  return (
    <div>
      Home
      {<h1>{user.email}</h1>}
    </div>
  );
}
export default Home;
