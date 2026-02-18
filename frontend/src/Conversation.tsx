import Sidebar from "./utils/Sidebar.tsx";
import Main from "./utils/Main.tsx"
import { useParams } from "react-router-dom";

// import { useNavigate } from "react-router-dom";
// function ListeConversations() {
//   const navigate = useNavigate();

//   const openConversation = (id) => {
//     navigate(`/chat/${id}`);
//   };

//   return (
//     <button onClick={() => openConversation(12345)}>
//       Ouvrir
//     </button>
//   );
// }

function Conversation({children =""})
{
    const { conversationId } = useParams()
    return (
        <Main>
            <div className="flex">
                <Sidebar> {children} </Sidebar>
                <h1 className="text-[#6E3CA3]"> TEST {conversationId} </h1>
            </div>
        </Main>
    )
}

export default Conversation

// window.location.href = `/chat/${id}