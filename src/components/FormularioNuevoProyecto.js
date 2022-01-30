import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Input, Button, Center} from 'native-base';

const FormularioNuevoProyecto = props => {
  const {handleSubmit, setNombre, isLoading} = props;
  return (
    <Center>
      <Input
        placeholder="Nombre del Proyecto"
        width={'95%'}
        size={'md'}
        backgroundColor="white"
        placeholderTextColor={'gray.700'}
        onChangeText={text => setNombre(text)}
      />

      <Button
        marginY={5}
        backgroundColor={'#28303b'}
        variant={'subtle'}
        _text={{
          color: 'white',
        }}
        shadow={2}
        width={'95%'}
        size="md"
        onPress={() => handleSubmit()}
        isLoading={isLoading}
        isLoadingText="CREANDO PROYECTO...">
        CREAR PROYECTO
      </Button>
    </Center>
  );
};

export default FormularioNuevoProyecto;

const styles = StyleSheet.create({});
