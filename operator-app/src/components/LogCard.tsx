import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { cardStyle } from '../styles/theme';

type Props = {
  log: {
    pumpName: string;
    startTime: string;
    endTime?: string;
    duration?: string;
    synced?: boolean;
  };
};

const LogCard: React.FC<Props> = ({ log }) => (
  <View style={[styles.card, cardStyle]}>
    <Text style={styles.title}>{log.pumpName}</Text>
    <Text style={styles.line}>Start: {log.startTime}</Text>
    {log.endTime ? <Text style={styles.line}>End: {log.endTime}</Text> : null}
    {log.duration ? <Text style={styles.line}>Duration: {log.duration}</Text> : null}
    <Text style={[styles.status, log.synced ? styles.synced : styles.pending]}>
      {log.synced ? 'Synced' : 'Pending sync'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 6,
  },
  line: {
    fontSize: 14,
    color: Colors.muted,
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
  },
  synced: {
    color: Colors.success,
  },
  pending: {
    color: Colors.warning,
  },
});

export default LogCard;
