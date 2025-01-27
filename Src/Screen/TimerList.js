import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {colors} from '../Common/Colors';

const TimerComponent = ({timer, onComplete}) => {
  const [remaining, setRemaining] = useState(timer.remaining);
  const [status, setStatus] = useState(timer.status);

  useEffect(() => {
    let interval;
    if (status === 'Running') {
      interval = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setStatus('Completed');
            onComplete(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleStart = () => setStatus('Running');
  const handlePause = () => setStatus('Paused');
  const handleReset = () => {
    setRemaining(timer.duration);
    setStatus('Paused');
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.categoryHeader}>{timer.category}</Text>
      <Text style={styles.text}>Name: {timer.name}</Text>
      <Text style={styles.text}>
        Time: <Text style={{fontWeight: 'bold'}}>{remaining}s</Text>
      </Text>
      <Text style={styles.text}>
        Status:{' '}
        <Text style={{color: colors.darkGrey, fontWeight: '800'}}>
          {status}
        </Text>
      </Text>

      <View
        style={{
          marginVertical: 5,
          backgroundColor: colors.primary,
        }}>
        <Button
          color={colors.black}
          title="Start"
          onPress={handleStart}
          disabled={status === 'Running' || status === 'Completed'}
        />
        <View style={{marginVertical: 3}}></View>
        <Button
          title="Pause"
          onPress={handlePause}
          color={colors.black}
          disabled={status !== 'Running'}
        />
        <View style={{marginVertical: 3}}></View>
        <Button
          title="Reset"
          onPress={handleReset}
          color={colors.black}
          disabled={status === 'Completed'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 3,
  },
  text: {
    fontSize: 14,
    marginTop: 3,
    fontWeight: '400',
  },
});
export default TimerComponent;
