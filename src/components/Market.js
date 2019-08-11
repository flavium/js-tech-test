import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  Button,
  Collapse,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  getOdds,
  getScore,
} from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Market(props) {
  const {
    market,
    oddsDisplay,
    collapsedOutcomes,
    clickable,
    getMarketOutcome,
    subscribe,
    unsubscribe,
  } = props;
  const [collapsed, setCollapsed] = useState(collapsedOutcomes);
  let subscriptionKeys = [];

  useEffect(
    () => {
      if (!clickable && market && market.outcomes.every(out => typeof out === 'number')) {
        getMarketOutcome(market.outcomes);
      }
    },
    [market]
  );

  const toggleMarket = (e) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
    if (!collapsed && market && market.outcomes.every(out => typeof out === 'number')) {
      subscriptionKeys = [`m.${market.marketId}`].concat(market.outcomes.map(outcome => `o.${outcome}`));
      getMarketOutcome(market.outcomes);
    }
    if (collapsed) {
      unsubscribe(subscriptionKeys);
    } else {
      subscribe(subscriptionKeys);
    }
  };

  if (!market || !market.status.displayable) {
    return null;
  }

  const addToSlip = (market, outcome) => {
    const toBeAdded = {
      marketName: market.name,
      marketId: market.marketId,
      outcomeName: outcome.name,
      outcomeId: outcome.outcomeId,
      price: outcome.price,
      status: outcome.status,
    };
    props.addToBetSlip(toBeAdded);
  };

  const getLayouts = (market, onBetClick) => {
    if (market.outcomes && !market.outcomes.every(out => typeof out !== 'number')){
      return null;
    }

    if (market.type === 'standard') {
      return (
        <Grid container={true}>
          {
            market.marketId
            && market.outcomes.every(outcome => typeof outcome === 'object')
            && market.outcomes.map((outcome, index) =>
              <Grid key={`_${outcome.name}_${index}`} className='StandardOutcomeContainer' item={true} xs={12}>
                <Grid className='StandardOutcomeName' item={true} xs={10}>
                  <Typography variant='body1'>{outcome.name}</Typography>
                </Grid>
                <Grid item={true} xs={2} className='OutcomeButtonContainer'>
                  <Button
                    className='OutcomeButton'
                    disabled={outcome.status.suspended}
                    onClick={() => onBetClick(market, outcome)}
                  >
                    {
                      !outcome.status.displayable
                        ? '-'
                        : outcome.status.suspended
                        ? 'SUSP'
                        : <span className='OutcomePrice' key={`${outcome.name}-odds`}>
                          {getOdds(outcome, oddsDisplay)}
                        </span>
                    }
                  </Button>
                </Grid>
              </Grid>
            )
          }
        </Grid>
      );
    }
    if (market.type = 'win-draw-win') {
      return (
        <Grid container={true} direction='row'>
          {
            market.marketId
            && market.outcomes.every(outcome => typeof outcome === 'object')
            && market.outcomes.map((outcome, index) =>
              <Grid key={`_${outcome.name}_${index}`} item={true} xs={4} className='OutcomeButtonContainer' >
                <Button
                  className='OutcomeButton'
                  disabled={outcome.status.suspended}
                  onClick={() => onBetClick(market, outcome)}
                >
                  {
                    !outcome.status.displayable
                      ? '-'
                      : outcome.status.suspended
                      ? 'SUSP'
                      : [
                        <span key={`${outcome.name}-name`}>{outcome.name}</span>,
                        <span className='OutcomePrice' key={`${outcome.name}-odds`}>
                          {getOdds(outcome, oddsDisplay)}
                        </span>
                      ]
                  }
                </Button>
              </Grid>
            )
          }
        </Grid>
      );
    }
    if (market.type === 'correct-score') {
      const groupedOutcomes = market.outcomes.reduce((acc, outcome) => {
        if (!acc.hasOwnProperty(outcome.type)) {
          acc[outcome.type] = [];
          acc[outcome.type].push(outcome);
        } else {
          acc[outcome.type].push(outcome);
        }
        return acc;
      }, {});

      return (
        <Grid container={true}>
          {
            Object.keys(groupedOutcomes).map(type =>
              <Grid key={type} item={true} xs={4} className='CorrectScoreOutcomes'>
                <Grid item={true} xs={12} className='CorrectScoreOutcomeName'>
                  <Typography variant='body1'>{type}</Typography>
                </Grid>
                {
                  groupedOutcomes[type].map((item, index) =>
                    <Grid key={`_${item.name}_${index}`} item={true} xs={12} className='OutcomeButtonContainer'>
                      <Button
                        className='OutcomeButton'
                        disabled={item.status.suspended}
                        onClick={() => onBetClick(market, item)}
                      >
                        {
                          !item.status.displayable
                            ? '-'
                            : item.status.suspended
                            ? 'SUSP'
                            : [
                              <span key={`${item.name}-name`}>
                                {`${getScore(item, 'home')} - ${getScore(item, 'away')}`}
                              </span>,
                              <span className='OutcomePrice' key={`${item.name}-odds`}>
                                {getOdds(item, oddsDisplay)}
                              </span>
                            ]
                        }
                      </Button>
                    </Grid>
                  )
                }
              </Grid>
            )
          }
        </Grid>
      );
    }
  };

  return (
    <Paper className={classNames('EventPrimaryMarket', props.className)} elevation={4}>
      <Typography variant='body1'>{market.name}</Typography>
      {
        clickable &&
        <Button className='MarketButton' onClick={(e) => toggleMarket(e)}>
          <FontAwesomeIcon icon={!collapsed ? 'chevron-down' : 'chevron-up'} />
        </Button>
      }
      <Collapse className='OutcomesContainer' in={collapsed} collapsedHeight='0px'>
        {getLayouts(market, addToSlip)}
      </Collapse>
    </Paper>
  );
}

Market.defaultProps = {
  market: null,
  oddsDisplay: '',
  collapsedOutcomes: false,
  clickable: false,
};

Market.propTypes = {
  market: PropTypes.object,
  oddsDisplay: PropTypes.string,
  collapsedOutcomes: PropTypes.bool,
  getMarketOutcome: PropTypes.func,
  subscribe: PropTypes.func,
  unsubscribe: PropTypes.func,
  addToBetSlip: PropTypes.func,
};

export default Market;
