import React, { useState } from "react";
import Modal from "../components/Modal";
import SelectExercise from "../components/SelectExercise";
import ActivityScheme from "../components/ActivityScheme";
import ActivityAdder from "../components/ActivityAdder";

function Activity() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      {showModal && (
        <Modal>
          <SelectExercise toggleModal={toggleModal} />
        </Modal>
      )}
      <div className="space-y-10">
        <div className="lg:flex lg:space-x-10 space-y-2 items-end">
          <h1 className="text-4xl">Activity</h1>
          <ActivityAdder toggleModal={toggleModal} />
        </div>
        <main className="flex flex-col">
          <section className="bg-white text-primary lg:p-10 p-5 rounded-xl space-y-4">
            <ActivityScheme />
          </section>
        </main>
      </div>
    </>
  );
}

export default Activity;
