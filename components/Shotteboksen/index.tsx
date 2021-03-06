import { RaffleCarousel } from 'components/Raffle/RaffleCarousel';
import { createPlayer } from 'features/players/player';
import { playerAdded, playersSelectors } from 'features/players/playersSlice';
import { createNewRaffleGame } from 'features/raffle/raffle';
import { gameStarted } from 'features/raffle/raffleGameSlice';
import { FC, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useDispatch, useSelector } from 'store/hooks';
import { randomInInterval } from 'utils/random';

import _s from './index.module.scss';

export const Shotteboksen: FC = () => {
  const dispatch = useDispatch();
  const allPlayerIds = useSelector(
    (state) => playersSelectors.selectIds(state.players) as string[],
    shallowEqual
  );
  const intervalMin = useSelector((state) => state.settings.interval.min);
  const intervalMax = useSelector((state) => state.settings.interval.max);
  const raffleListLength = useSelector(
    (state) => state.settings.raffleListLength
  );
  const playState = useSelector((state) => state.raffleGame.playState);

  const playerCount = allPlayerIds.length;

  useEffect(() => {
    if (!allPlayerIds.length) {
      return;
    }
    const nextRaffleTime = randomInInterval(intervalMin, intervalMax);

    const startRaffle = () => {
      const [entries, winnerEntryId] = createNewRaffleGame(
        allPlayerIds,
        raffleListLength
      );
      dispatch(
        gameStarted({
          entries,
          winnerEntryId,
        })
      );
    };

    startRaffle();

    const timeoutId = setTimeout(startRaffle, nextRaffleTime);
    return () => clearTimeout(timeoutId);
  }, [intervalMin, intervalMax, raffleListLength, allPlayerIds]);

  return (
    <div className={_s.container}>
      <p>Antall spillere: {playerCount}</p>
      {playState === 'playing' ? <RaffleCarousel /> : null}
    </div>
  );
};
