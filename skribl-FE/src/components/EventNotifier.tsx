import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import { roundService } from "../services/RoundService";
import store from "../store";
import Button from "./Button";
import Notification from "../components/Notification";
import { isEmpty } from "lodash";

interface Props {}

const EventNotifier: React.FC<Props> = (props) => {
  const { currentPlayerId, choosing, myChance, wordList, currentWord } =
    store.gameStore;
  const drawer = store.gameStore.getPlayerById(currentPlayerId!);

  const memorizedWord = useMemo(() => {
    return wordList.map((word) => (
      <Button
        onClick={() => {
          roundService.roundSyncClient(word);
        }}
        key={word}
      >
        {word}
      </Button>
    ));
  }, [myChance, choosing, wordList]);

  const [notifySelection, setNotifySelection] = useState(false);
  const [wordReveal, setWordReveal] = useState(false);

  useEffect(() => {
    if(myChance || !drawer)
    return;
    setNotifySelection(true);
    setTimeout(() => {
      setNotifySelection(false);
    }, 2000);
  }, [choosing,myChance,drawer]);

  useEffect(() => {
    if(myChance || choosing)
      return;
    if (currentWord) {
      setWordReveal(true);
      setTimeout(() => {
        setWordReveal(false);
      }, 2000);
    }
  }, [myChance, currentWord]);

  return (
    <>
      <Notification open={choosing && myChance && !currentWord}>
        <div className="flex flex-col items-center space-y-4">
          <h2>Choose a word</h2>
          {memorizedWord}
        </div>
      </Notification>
      <Notification open={wordReveal}>
        <h2>Word was {currentWord}</h2>
      </Notification>
      <Notification open={notifySelection}>
        <>
          {choosing ? (
            <span>
              <span className="text-green-700">{drawer?.name}</span> is choosing
              a word
            </span>
          ) : (
            <span>
              <span className="text-green-700">{drawer?.name}</span> starts
              drawing
            </span>
          )}
        </>
      </Notification>
    </>
  );
};

EventNotifier.defaultProps = {};

export default observer(EventNotifier);
