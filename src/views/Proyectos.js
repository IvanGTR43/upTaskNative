import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  FlatList,
  Heading,
  Pressable,
  Stack,
  Center,
  Box,
  Text,
  Spinner,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {gql, useQuery} from '@apollo/client';

import globalStyles from '../styles/global';

const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;

const Proyectos = () => {
  //navegacion
  const navigation = useNavigation();

  //Apollo

  const {data, loading, error} = useQuery(OBTENER_PROYECTOS);

  return (
    <View style={{backgroundColor: '#e84347', flex: 1}}>
      <Button
        mt="20px"
        size="md"
        backgroundColor={'#28303b'}
        variant={'subtle'}
        _text={{
          color: 'white',
        }}
        shadow={2}
        onPress={() => navigation.navigate('nuevo-proyecto')}>
        NUEVO PROYECTO
      </Button>
      {loading && <Spinner size="lg" />}
      <Heading
        textAlign={'center'}
        mb={'20px'}
        mt={'20px'}
        color={'white'}
        bold>
        Selecciona Un Proyecto
      </Heading>
      {!data ? (
        <Spinner size={'lg'} />
      ) : (
        <FlatList
          data={data.obtenerProyectos}
          renderItem={({item}) => (
            <Proyecto item={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

export default Proyectos;

const styles = StyleSheet.create({});

const Proyecto = props => {
  const {item, navigation} = props;
  return (
    <Box flexDirection={'column'} flex={1} mx={'8px'}>
      <Pressable
        onPress={() => navigation.navigate('proyecto', item)}
        shadow={3}>
        {({isHovered, isFocused, isPressed}) => {
          return (
            <Center
              borderBottomWidth="1"
              backgroundColor={'white'}
              bg={
                isPressed
                  ? 'coolGray.200'
                  : isHovered
                  ? 'coolGray.200'
                  : 'coolGray.100'
              }
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}>
              <Text my={'12px'}>{item.nombre}</Text>
            </Center>
          );
        }}
      </Pressable>
    </Box>
  );
};
