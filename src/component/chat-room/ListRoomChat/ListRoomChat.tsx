import {
  collection,
  onSnapshot,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import add from "../../../assets/png/add.png";
import downArrow from "../../../assets/png/down-arrow.png";
import edit from "../../../assets/png/edit.png";
import loupe from "../../../assets/png/loupe.png";
import more from "../../../assets/png/more.png";
import { db } from "../../../config/FirebaseConfig";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/userSlice";
import { SelectedRoom } from "../../RoomChat";
import AddRoomChat from "./AddRoomChat";

export interface Props {
  getSelectRoom: (param: SelectedRoom) => void;
}
interface Condition {
  fieldName: string;
  opStr: WhereFilterOp;
  value: string;
}
interface UserCondition {
  fieldName: string;
  opStr: WhereFilterOp;
  value: string[] | null;
}

const ListRoomChat = ({ getSelectRoom }: Props) => {
  const [modalShow, setModalShow] = React.useState<Boolean>(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [data, setData] = useState<any[]>([]);

  const user = useAppSelector(selectUser);
  const { uid } = user;

  const conditionRef: Condition | null = useMemo(() => {
    return {
      fieldName: "members",
      opStr: "array-contains",
      value: uid,
    };
  }, [uid]);

  useEffect(() => {
    if (!conditionRef) return;
    const getRooms = async (condition: Condition) => {
      const collectionRef = query(
        collection(db, "rooms"),
        where(condition.fieldName, condition.opStr, condition.value)
      );
      const q = query(collectionRef);
      const unsubcribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          const document: any = doc.data();
          document.id = doc.id;
          items.push(document);
        });
        setData(items);
      });
      return () => {
        unsubcribe();
      };
    };
    getRooms(conditionRef);
  }, [conditionRef, setData]);

  const selectedRoom: SelectedRoom = useMemo(
    () => data.find((room) => room.id === selectedRoomId),
    [data, selectedRoomId]
  );
  console.log(uid, selectedRoom?.members);

  useEffect(() => {
    getSelectRoom(selectedRoom);
  });

  const usersCondition: UserCondition = useMemo(() => {
    if (!selectedRoom) return;
    return {
      fieldName: uid,
      opStr: "in",
      value: selectedRoom?.members,
    };
  }, []);

  // useEffect(() => {
  //   if (!usersCondition) return;
  //   const getRooms = async (condition: UserCondition) => {
  //     const collectionRef = query(
  //       collection(db, "users"),
  //       where(condition.fieldName, condition.opStr, condition.value)
  //     );
  //     const q = query(collectionRef);
  //     const unsubcribe = onSnapshot(q, (querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         console.log(doc);
  //       });
  //     });
  //     return () => {
  //       unsubcribe();
  //     };
  //   };
  //   getRooms(usersCondition);
  // }, [usersCondition]);

  return (
    <>
      <div className="list__top">
        <div className="list__top-container">
          <div className="list__top-title d-flex justify-between align-center">
            <h3 className="font-weight-bold mb-0">Chat</h3>
            <button className="list__top-title__btn w-h-36px">
              <span>
                <img className="list__top-edit" src={edit} alt="edit" />
              </span>
            </button>
          </div>
          <div className="list__top-nav mb-12 d-flex align-center">
            <button className="list__top-nav__btn">Tất cả</button>
            <button className="list__top-nav__btn m-l-r-8">Chưa đọc</button>
            <button className="list__top-nav__btn btn-list__top-more w-h-36px">
              <span>
                <img src={more} alt="more" />
              </span>
            </button>
          </div>
          <div className="list__top-search">
            <span>
              <img src={loupe} alt="loupe" />
            </span>
            <input
              className="list__top-search__content"
              type="text"
              placeholder="Search Workplace Chat..."
            />
          </div>
        </div>
      </div>
      <div className="list__bottom">
        <div className="list__bottom-container">
          <h5 className="list__bottom-roomlist">
            Danh sách các phòng{" "}
            <span>
              <img src={downArrow} alt="downArrow" />
            </span>
          </h5>
          <ul className="list__bottom-roomlist__item">
            {/* Danh sách phòng */}
            {data.map((doc) => (
              <li
                className="roomlist__item-name"
                key={doc.id}
                onClick={() => setSelectedRoomId(doc.id)}
              >
                {doc.name}
              </li>
            ))}

            <Button
              className="btn btn-primary roomlist__item-add d-flex align-center"
              variant="primary"
              onClick={() => setModalShow(true)}
            >
              <span className="roomlist__item-add-btn">
                <img src={add} alt="add" />
              </span>
              <span>Thêm phòng</span>
            </Button>

            <AddRoomChat
              show={modalShow}
              onHide={() => setModalShow(false)}
              setData={setData}
            />
          </ul>
        </div>
      </div>
    </>
  );
};

export default ListRoomChat;
