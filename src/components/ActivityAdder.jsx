import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/auth/AuthContext";
import {
  useWorkoutDispatch,
  useWorkoutState,
} from "../contexts/workout/WorkoutContext";
import { database } from "../firebase";
import { padNum, persist } from "../helpers";
import useTimer from "../hooks/useTimer";
import Button from "./Button";

function ActivityAdder({ toggleModal }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const dispatch = useWorkoutDispatch();

  const { exercises, workoutInProgress } = useWorkoutState();

  const { user } = useAuth();

  const {
    secondsPassed,
    isActive,
    isPaused,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
  } = useTimer();



  const handleStart = () => {
    dispatch({
      type: "START_WORKOUT",
    });
  };

  const handleDiscard = () => {
    dispatch({
      type: "DISCARD_WORKOUT",
    });
  };

  const newMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleSave = async () => {
    newMessage("");
    setLoading(true);

    try {
      await database.workouts.add({
        workout: exercises,
        secondsPassed,
        userId: user.uid,
        createdAt: database.getCurrentTimestamp(),
      });

      newMessage("Saved succesfully");
      handleDiscard();
    } catch (err) {
      newMessage(err.message);
    }

    setLoading(false);
  };

  const finishedSets = Object.values(exercises).filter(
    (exercise) =>
      Object.values(exercise.sets).filter((set) => set.isFinished === true)
        .length > 0
  );

  const showSave = finishedSets.length > 0;

  return (
    <div className="flex flex-wrap items-center space-x-4">
      {workoutInProgress ? (
        <ActiveWorkoutTimer
          showSave={showSave}
          handleSave={handleSave}
          handleDiscard={handleDiscard}
          loading={loading}
          stopTimer={stopTimer}
          toggleModal={toggleModal}
        />
      ) : (
        <Button
          value="Start Recap"
          type="submit"
          variant="primary"
          action={handleStart}
        />
      )}
      <div className="text-primary font-semibold">{message && message}</div>
      {workoutInProgress && !showSave ? (
        <div className="text-primary text-sm pt-4 lg:pt-0">
          Complete at least one activity to save this recap
        </div>
      ) : null}
    </div>
  );
}

function ActiveWorkoutTimer({
  showSave,
  handleSave,
  handleDiscard,
  loading,
  toggleModal,
}) {
  return (
    <>
      <Button
        value="Discard Recap"
        variant="red"
        type="submit"
        action={handleDiscard}
      />
      {showSave && (
        <Button
          value="Save Recap"
          type="submit"
          variant="primary"
          action={handleSave}
          loading={loading}
        />
      )}

      <Button
        value="Add Activity"
        variant="primary"
        type="submit"
        action={toggleModal}
      />
    </>
  );
}

export default ActivityAdder;
