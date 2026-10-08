import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons';


// ============================================================
// TELAS
// ============================================================

import telaLogin from './screens/telaLogin';
import telaHome from './screens/telaHome';
import telaDashboard from './screens/telaDashboard';
import telamov from './screens/telamov';
import telaPerfil from './screens/telaPerfil';


// ============================================================
// NAVEGADORES
// ============================================================

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();


// ============================================================
// CORES
// ============================================================

const C = {
  bg: '#F5F8FA',
  white: '#FFFFFF',

  deep: '#123A73',
  muted: '#7B8AA0',

  border: '#E6ECF1',
};


// ============================================================
// BOTTOM TABS
// ============================================================

function BottomTabs({ route }) {

  // ==========================================================
  // CLIENTE RECEBIDO DO LOGIN
  // ==========================================================

  const cliente =
    route?.params?.cliente ||
    route?.params?.usuario ||
    route?.params?.user ||
    null;


  return (
    <Tab.Navigator

      // ========================================================
      // CONFIGURAÇÕES
      // ========================================================

      screenOptions={({ route }) => ({

        headerShown: false,

        // ======================================================
        // ANIMAÇÃO DAS ABAS
        // ======================================================

        animation: 'shift',

        // ======================================================
        // BARRA INFERIOR
        // ======================================================

        tabBarStyle: {
          height: 78,

          paddingTop: 8,
          paddingBottom: 14,

          backgroundColor: C.white,

          borderTopWidth: 1,
          borderTopColor: C.border,

          elevation: 10,

          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: {
            width: 0,
            height: -3,
          },
        },

        // ======================================================
        // TEXTO
        // ======================================================

        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
        },

        // ======================================================
        // CORES
        // ======================================================

        tabBarActiveTintColor: C.deep,
        tabBarInactiveTintColor: C.muted,

        // ======================================================
        // ÍCONE
        // ======================================================

        tabBarIcon: ({ color, focused }) => {

          let icon = 'circle-outline';

          // HOME
          if (route.name === 'Home') {

            icon = focused
              ? 'home'
              : 'home-outline';

          }

          // DASHBOARD
          else if (route.name === 'Dashboard') {

            icon = focused
              ? 'view-dashboard'
              : 'view-dashboard-outline';

          }

          // MOVIMENTAÇÃO
          else if (route.name === 'Movimentação') {

            icon = 'swap-horizontal';

          }

          // PERFIL
          else if (route.name === 'Perfil') {

            icon = focused
              ? 'account-circle'
              : 'account-circle-outline';

          }


          return (
            <MaterialCommunityIcons
              name={icon}
              size={22}
              color={color}
            />
          );

        },

      })}


      // ========================================================
      // HOME
      // ========================================================

      initialRouteName="Home"

    >

      <Tab.Screen
        name="Home"
        component={telaHome}
        initialParams={{
          cliente,
          usuario: cliente,
          user: cliente,
        }}
        options={{
          title: 'Home',
        }}
      />


      {/* ======================================================
          DASHBOARD
      ====================================================== */}

      <Tab.Screen
        name="Dashboard"
        component={telaDashboard}
        initialParams={{
          cliente,
          usuario: cliente,
          user: cliente,
        }}
        options={{
          title: 'Dashboard',
        }}
      />


      {/* ======================================================
          MOVIMENTAÇÃO
      ====================================================== */}

      <Tab.Screen
        name="Movimentação"
        component={telamov}
        initialParams={{
          cliente,
          usuario: cliente,
          user: cliente,
        }}
        options={{
          title: 'Movimentação',
        }}
      />


      {/* ======================================================
          PERFIL
      ====================================================== */}

      <Tab.Screen
        name="Perfil"
        component={telaPerfil}
        initialParams={{
          cliente,
          usuario: cliente,
          user: cliente,
        }}
        options={{
          title: 'Perfil',
        }}
      />

    </Tab.Navigator>
  );
}


// ============================================================
// APP PRINCIPAL
// ============================================================

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"

        screenOptions={{
          headerShown: false,
        }}
      >

        {/* ====================================================
            LOGIN
        ==================================================== */}

        <Stack.Screen
          name="Login"
          component={telaLogin}
        />


        {/* ====================================================
            SISTEMA
        ==================================================== */}

        <Stack.Screen
          name="Sistema"
          component={BottomTabs}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );
}