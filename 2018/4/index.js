const path = require('path');

const { parseFile } = require('../utils/parseFile');

const guardsSchedule = parseFile(path.join(__dirname, 'data.txt')).sort();

const guardRegex = /#(\d+)/;
const guardAsleepRegex = /\d{2}:(\d{2}).*asleep/;
const guardWakeUpRegex = /\d{2}:(\d{2}).*wakes/;
const guardsScheduleProcessed = {};
let mostAsleepGuard = { totalAsleepMinutes: 0 };
let mostFrequentlyAsleepOnParticularMinuteGuard = { minute: null, frequency: null };

const getGuardMostAsleepMinute = (guardData) => {
  const sortedAsleepStat = Array.from(guardData.asleepMinutesStat.entries());

  if (!sortedAsleepStat.length) {
    return { minute: null, frequency: null };
  }

  if (sortedAsleepStat.length > 1) {
    sortedAsleepStat.sort((a, b) => {
      return b[1] - a[1];
    });
  }

  const [mostFrequentEntry] = sortedAsleepStat;

  return {
    minute: mostFrequentEntry[0],
    frequency: mostFrequentEntry[1],
  };
};

const processGuardsSchedule = () => {
  for (let i = 0; i < guardsSchedule.length; i++) {
    const currentGuard = guardsSchedule[i].match(guardRegex);

    if (currentGuard) {
      const [, id] = currentGuard;

      const currentGuardData = guardsScheduleProcessed[id] = guardsScheduleProcessed[id] || {
        id,
        totalAsleepMinutes: 0,
        asleepMinutesStat: new Map(),
      };

      for (let j = i + 1; guardsSchedule[j]; j += 2) {
        const guard = guardsSchedule[j].match(guardRegex);

        if (guard) {
          i = j - 1;

          break;
        }

        const [, sleepMinuteStart] = guardsSchedule[j].match(guardAsleepRegex).map(Number);
        const [, sleepMinuteEnd] = guardsSchedule[j + 1].match(guardWakeUpRegex).map(Number);

        currentGuardData.totalAsleepMinutes += sleepMinuteEnd - sleepMinuteStart;

        for (let z = sleepMinuteStart; z < sleepMinuteEnd; z++) {
          currentGuardData.asleepMinutesStat.set(z, (currentGuardData.asleepMinutesStat.get(z) || 0) + 1);
        }
      }

      if (currentGuardData.totalAsleepMinutes > mostAsleepGuard.totalAsleepMinutes) {
        mostAsleepGuard = currentGuardData;
      }

      const mostFrequentAsleepMinute = getGuardMostAsleepMinute(currentGuardData);

      if (mostFrequentAsleepMinute.frequency > mostFrequentlyAsleepOnParticularMinuteGuard.frequency) {
        mostFrequentlyAsleepOnParticularMinuteGuard = {
          id: currentGuardData.id,
          ...mostFrequentAsleepMinute,
        };
      }
    }
  }
};

processGuardsSchedule();

console.log('Part 1:', mostAsleepGuard.id * getGuardMostAsleepMinute(mostAsleepGuard).minute);
console.log('Part 2:', mostFrequentlyAsleepOnParticularMinuteGuard.id * mostFrequentlyAsleepOnParticularMinuteGuard.minute);
