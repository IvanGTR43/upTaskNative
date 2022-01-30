import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Box, useToast, Text, HStack, Pressable, Center} from 'native-base';

const Tarea = ({item}) => {
  const {nombre, estado} = item;
  return (
    <Box>
      <Center>
        <HStack
          backgroundColor={'white'}
          justifyContent="space-between"
          width="84%">
          <Text my={'16px'} bold ml={'8px'}>
            {nombre}
          </Text>
          <Box my={'16px'} mr={'8px'}>
            <Icon
              name={
                estado
                  ? 'checkbox-marked-circle'
                  : 'checkbox-marked-circle-outline'
              }
              size={32}
              color={estado ? 'green' : 'gray'}
            />
          </Box>
        </HStack>
      </Center>
    </Box>
  );
};

export default Tarea;
