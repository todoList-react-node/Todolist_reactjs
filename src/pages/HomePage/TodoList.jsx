import {
  faPenNib,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popup } from "components/popup/Popup.jsx";
import useActions from "hooks/useAction.js";
import { useEffect, useState } from "react";
import { SNACKBAR_SEVERITY, snackBarAction } from "../../redux/snackbar.js";
import {
  addNew,
  completeTodo,
  dlTodo,
  getAll,
  uncompleteTodo,
  update,
} from "rest/api/todolist.js";
function TodoList() {
  const { show } = useActions(snackBarAction);

  const [text, setText] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [valueUpdate, setValUpdate] = useState({
    id: null,
    text: null,
  });
  const handlePopup = (id, txt) => {
    setValUpdate({
      id: id,
      text: txt,
    });
  };

  const addTodo = async () => {
    if (text.length > 100) return;
    try {
      await addNew({ name: text, isComplete: false });
      getTodoList();
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const getTodoList = async () => {
    try {
      const res = await getAll();
      setTodoList((_) => res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (id, txt) => {
    try {
      const payload = { name: txt };
      await update(id, payload);
      show({
        message: "Update successfull",
        severity: SNACKBAR_SEVERITY.SUCCESS,
        autoHideDuration: 10000,
      });
      getTodoList();
    } catch (error) {
      show({
        message: "Update fail",
        severity: SNACKBAR_SEVERITY.ERROR,
        autoHideDuration: 10000,
      });
    }
  };

  const deleteTodo = async (id) => {
    try {
      await dlTodo(id);
      getTodoList();
      show({
        message: "Delete successfull",
        severity: SNACKBAR_SEVERITY.SUCCESS,
        autoHideDuration: 10000,
      });
    } catch (error) {
      show({
        message: "Delete fail",
        severity: SNACKBAR_SEVERITY.ERROR,
        autoHideDuration: 10000,
      });
    }
  };

  const updateComplete = async (id) => {
    try {
      await completeTodo(id, { isComplete: true });
      getTodoList();
    } catch (error) {
      show({
        message: "Update fail",
        severity: SNACKBAR_SEVERITY.ERROR,
        autoHideDuration: 10000,
      });
    }
  };

  const unComplete = async (id) => {
    try {
      await uncompleteTodo(id, { isComplete: false });
      getTodoList();
    } catch (error) {
      show({
        message: "Update fail",
        severity: SNACKBAR_SEVERITY.ERROR,
        autoHideDuration: 10000,
      });
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <>
      <div className="flex-[15_0_0%] w-full bg-lime-400 flex flex-row justify-center items-center relative">
        <div className="w-1/3 h-5/6 rounded-xl bg-lime-500 shadow-xl flex flex-col">
          <div className="flex-[1_0_0]  p-1 pt-3 flex flex-col items-center justify-center gap-2">
            <div className="h-2/4 w-11/12 rounded-xl border-solid border-2 border-[#69ad28]">
              <input
                type="text"
                value={text}
                className=" w-full h-full rounded-xl outline-none border-none pl-1"
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex-[1_0_0] flex flex-row gap-3 w-full justify-center">
              <button
                className="p-1 px-2 rounded-xl bg-[#F4538A] text-[#FFF] font-semibold hover:bg-[#FFB5DA] transition-colors duration-75 active:bg-[#FF3EA5]"
                onClick={addTodo}
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex-[5_0_0] px-2 py-3 overflow-x-hidden overflow-y-scroll scrollbar">
            <div className="flex flex-col items-center justify-start gap-2 h-auto w-full">
              {todoList.length > 0
                ? todoList.map((vl) => (
                    <div
                      key={vl._id}
                      className="shadow-xl rounded-xl cursor-pointer indent-1 py-1 px-2 w-full min-h-14 font-mono text-left bg-[#F3CA52] transition duration-1000 ease-in-out flex flex-row items-center"
                    >
                      <div className="flex-[3_0_0] h-auto overflow-hidden ">
                        <p
                          className={`overflow-hidden break-words ${
                            vl.isComplete === true ? "line-through" : ""
                          }`}
                        >
                          {vl.name}
                        </p>
                      </div>
                      <div className="flex-[1_0_0] flex h-full flex-row items-center justify-around overflow-hidden">
                        {vl.isComplete === false ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            onClick={() => updateComplete(vl._id)}
                            className="transition duration-100 ease-linear text-[20px] text-[#F4538A] hover:text-[#fff] hover:scale-105 "
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faXmark}
                            onClick={() => unComplete(vl._id)}
                            className="transition duration-100 ease-linear text-[20px] text-[#F4538A] hover:text-[#fff] hover:scale-105 "
                          />
                        )}
                        <FontAwesomeIcon
                          icon={faPenNib}
                          onClick={() => handlePopup(vl._id, vl.name)}
                          className="transition duration-100 ease-linear text-[20px] text-[#F4538A] hover:text-[#fff] hover:scale-105 "
                        />
                        <FontAwesomeIcon
                          onClick={() => deleteTodo(vl._id)}
                          icon={faTrash}
                          className="transition duration-100 ease-linear text-[20px] text-[#F4538A] hover:text-[#fff] hover:scale-105"
                        />
                      </div>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
        {valueUpdate?.id != null && (
          <Popup
            valUpdate={valueUpdate}
            setValUpdate={setValUpdate}
            updateTodo={updateTodo}
          />
        )}
      </div>
    </>
  );
}

export default TodoList;
