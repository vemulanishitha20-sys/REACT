import axios from "axios";
import { useEffect, useState } from "react";

export default function Sellers() {
  const [users, setUsers] = useState([]);
  const [usersStatus, setUsersStatus] = useState("idle");
  const [usersError, setUsersError] = useState("");

  useEffect(() => {
    if (usersStatus !== "idle") {
      return;
    }

    setUsersStatus("loading");
    axios
      .get("https://dummyjson.com/users")
      .then((res) => {
        setUsers(res.data.users ?? []);
        setUsersStatus("success");
      })
      .catch((error) => {
        setUsersError(error.message);
        setUsersStatus("error");
      });
  }, [usersStatus]);

  return (
    <section className="sellers-page" aria-label="Sellers">
      <div className="sellers-header">
        <h2>Sellers</h2>
        <p>{users.length} profiles</p>
      </div>

      {usersStatus === "loading" && (
        <p className="empty-state">Loading sellers...</p>
      )}
      {usersStatus === "error" && <p className="empty-state">{usersError}</p>}

      {usersStatus === "success" && (
        <div className="sellers-grid">
          {users.map((user) => (
            <article className="seller-card" key={user.id}>
              <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
              <div className="seller-card-body">
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <p>{user.company?.title || user.role || "Seller"}</p>
                <dl>
                  <div>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{user.phone}</dd>
                  </div>
                  <div>
                    <dt>City</dt>
                    <dd>{user.address?.city}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
