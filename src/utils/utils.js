import moment from 'moment';

export const getTime = (eventItem, defaultTime) => {
  if (eventItem && eventItem.status.active && eventItem.status.started) {
    return Math.floor(moment.duration(moment(eventItem.startTime).diff(moment(defaultTime))).asMinutes());
  }
};

export const getCompetitor = (eventItem, position) =>
  eventItem && eventItem.competitors.find(comp => comp.position === position).name;

export const getScore = (eventItem, position) =>
  eventItem && eventItem.scores ? eventItem.scores[position] : eventItem.score[position];

export const getOdds = (outcome, display) => {
  if (display === 'decimal') {
    return outcome.price.decimal;
  }
  return `${outcome.price.num}/${outcome.price.den}`;
};
