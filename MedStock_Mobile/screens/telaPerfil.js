import React, {
    useCallback,
    useEffect,
    useState,
  } from "react";
  
  import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    StatusBar,
    RefreshControl,
  } from "react-native";
  
  import { LinearGradient } from "expo-linear-gradient";
  
  import {
    Feather,
    MaterialCommunityIcons,
  } from "@expo/vector-icons";
  
  
  // ==========================================================
  // CONFIGURAÇÃO DA API
  // ==========================================================
  
  // Android Emulator
  const API_URL = "http://10.0.2.2:5000";
  
  // Celular físico:
  // const API_URL = "http://192.168.0.100:5000";
  
  
  // ==========================================================
  // CORES
  // ==========================================================
  
  const COLORS = {
    background: "#F5F8FA",
    card: "#FFFFFF",
  
    foreground: "#1E3A66",
    primary: "#2C7BA6",
  
    muted: "#F1F5F8",
    mutedText: "#7B8794",
  
    border: "#E4EAF0",
  
    teal: "#3FC7C7",
    deep: "#12386E",
  
    destructive: "#D9534F",
  
    white: "#FFFFFF",
  };
  
  
  // ==========================================================
  // TELA PERFIL
  // ==========================================================
  
  export default function TelaPerfil({
    route,
    navigation,
  }) {
  
    // ========================================================
    // CLIENTE RECEBIDO
    // ========================================================
  
    const clienteRecebido =
      route?.params?.cliente || null;
  
  
    // ========================================================
    // ESTADOS
    // ========================================================
  
    const [cliente, setCliente] =
      useState(clienteRecebido);
  
    const [carregando, setCarregando] =
      useState(true);
  
    const [refreshing, setRefreshing] =
      useState(false);
  
  
    // ========================================================
    // BUSCAR PERFIL
    // ========================================================
  
    const carregarPerfil = useCallback(
      async (mostrarErro = true) => {
  
        try {
  
          // --------------------------------------------------
          // Verifica se recebeu o cliente
          // --------------------------------------------------
  
          if (!clienteRecebido?.id) {
  
            console.log(
              "Perfil: nenhum ID de cliente recebido."
            );
  
            setCarregando(false);
            setRefreshing(false);
  
            if (mostrarErro) {
  
              Alert.alert(
                "Usuário não identificado",
                "Não foi possível identificar o usuário conectado."
              );
  
            }
  
            return;
          }
  
  
          console.log(
            "Buscando perfil do cliente:",
            clienteRecebido.id
          );
  
  
          // --------------------------------------------------
          // API
          // --------------------------------------------------
  
          const resposta = await fetch(
            `${API_URL}/api/cliente/perfil?id=${clienteRecebido.id}`,
            {
              method: "GET",
  
              headers: {
                Accept: "application/json",
              },
            }
          );
  
  
          // --------------------------------------------------
          // Verifica HTTP
          // --------------------------------------------------
  
          if (!resposta.ok) {
  
            throw new Error(
              `Erro HTTP ${resposta.status}`
            );
  
          }
  
  
          // --------------------------------------------------
          // JSON
          // --------------------------------------------------
  
          const dados =
            await resposta.json();
  
  
          console.log(
            "Resposta perfil:",
            dados
          );
  
  
          // --------------------------------------------------
          // SUCESSO
          // --------------------------------------------------
  
          if (
            dados.sucesso &&
            dados.cliente
          ) {
  
            setCliente(
              dados.cliente
            );
  
          } else {
  
            throw new Error(
              dados.erro ||
              "Não foi possível carregar o perfil."
            );
  
          }
  
        } catch (erro) {
  
          console.log(
            "Erro ao carregar perfil:",
            erro
          );
  
  
          if (mostrarErro) {
  
            Alert.alert(
              "Erro de conexão",
              "Não foi possível carregar os dados do perfil."
            );
  
          }
  
        } finally {
  
          setCarregando(false);
          setRefreshing(false);
  
        }
  
      },
      [
        clienteRecebido?.id,
      ]
    );
  
  
    // ========================================================
    // CARREGAR AO ABRIR
    // ========================================================
  
    useEffect(() => {
  
      carregarPerfil();
  
    }, [carregarPerfil]);
  
  
    // ========================================================
    // ATUALIZAR
    // ========================================================
  
    const atualizar = useCallback(() => {
  
      setRefreshing(true);
  
      carregarPerfil(false);
  
    }, [carregarPerfil]);
  
  
    // ========================================================
    // DADOS DO CLIENTE
    // ========================================================
  
    const nome =
      cliente?.nome ||
      "Usuário";
  
    const email =
      cliente?.email ||
      "Não informado";
  
    const cpf =
      cliente?.cpf ||
      "Não informado";
  
  
    // ========================================================
    // NAVEGAÇÃO
    // ========================================================
  
    const irParaHome = () => {
  
      navigation.navigate(
        "Home",
        {
          cliente: cliente,
        }
      );
  
    };
  
  
    const irParaDashboard = () => {
  
      navigation.navigate(
        "Dashboard",
        {
          cliente: cliente,
        }
      );
  
    };
  
  
    const irParaMovimentacao = () => {
  
      navigation.navigate(
        "mov",
        {
          cliente: cliente,
        }
      );
  
    };
  
  
    // ========================================================
    // LOADING
    // ========================================================
  
    if (carregando) {
  
      return (
  
        <View style={styles.loadingScreen}>
  
          <StatusBar
            barStyle="dark-content"
            backgroundColor={
              COLORS.background
            }
          />
  
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
  
          <Text style={styles.loadingText}>
            Carregando perfil...
          </Text>
  
        </View>
  
      );
  
    }
  
  
    // ========================================================
    // TELA
    // ========================================================
  
    return (
  
      <View style={styles.container}>
  
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.deep}
        />
  
  
        {/* ==================================================
            CABEÇALHO
        ================================================== */}
  
        <LinearGradient
          colors={[
            COLORS.deep,
            COLORS.teal,
          ]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.header}
        >
  
          <SafeAreaView>
  
            <View style={styles.headerRow}>
  
              {/* VOLTAR */}
  
              <Pressable
                style={styles.iconButton}
                accessibilityLabel="Voltar"
                onPress={() => {
  
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
  
                }}
              >
  
                <Feather
                  name="arrow-left"
                  size={20}
                  color={COLORS.white}
                />
  
              </Pressable>
  
  
              {/* TÍTULO */}
  
              <View style={styles.headerTitle}>
  
                <Text style={styles.brand}>
                  PERFIL
                </Text>
  
                <Text style={styles.brandSubtitle}>
                  MEDSTOCK
                </Text>
  
              </View>
  
  
              {/* NOTIFICAÇÕES */}
  
              <Pressable
                style={styles.iconButton}
                accessibilityLabel="Notificações"
              >
  
                <Feather
                  name="bell"
                  size={20}
                  color={COLORS.white}
                />
  
                <View
                  style={
                    styles.notificationDot
                  }
                />
  
              </Pressable>
  
            </View>
  
          </SafeAreaView>
  
        </LinearGradient>
  
  
        {/* ==================================================
            CONTEÚDO
        ================================================== */}
  
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
  
            <RefreshControl
              refreshing={refreshing}
              onRefresh={atualizar}
              colors={[
                COLORS.primary,
              ]}
              tintColor={
                COLORS.primary
              }
            />
  
          }
        >
  
  
          {/* ==================================================
              CARD PERFIL
          ================================================== */}
  
          <View
            style={[
              styles.card,
              styles.profileCard,
            ]}
          >
  
            {/* AVATAR */}
  
            <View
              style={
                styles.avatarContainer
              }
            >
  
              <View style={styles.avatar}>
  
                <Feather
                  name="user"
                  size={36}
                  color={
                    COLORS.mutedText
                  }
                />
  
              </View>
  
  
              <View
                style={
                  styles.onlineDot
                }
              />
  
            </View>
  
  
            {/* NOME */}
  
            <Text style={styles.name}>
              {nome}
            </Text>
  
  
            {/* CARGO */}
  
            <View style={styles.role}>
  
              <Feather
                name="shield"
                size={13}
                color={
                  COLORS.primary
                }
              />
  
              <Text
                style={
                  styles.roleText
                }
              >
                Operador de Estoque
              </Text>
  
            </View>
  
  
            {/* ==================================================
                INFORMAÇÕES
            ================================================== */}
  
            <View style={styles.fields}>
  
  
              {/* NOME */}
  
              <View style={styles.field}>
  
                <View
                  style={
                    styles.fieldIcon
                  }
                >
  
                  <Feather
                    name="user"
                    size={16}
                    color={
                      COLORS.primary
                    }
                  />
  
                </View>
  
                <View
                  style={
                    styles.fieldTexts
                  }
                >
  
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    NOME COMPLETO
                  </Text>
  
                  <Text
                    style={
                      styles.fieldValue
                    }
                    numberOfLines={1}
                  >
                    {nome}
                  </Text>
  
                </View>
  
              </View>
  
  
              {/* EMAIL */}
  
              <View style={styles.field}>
  
                <View
                  style={
                    styles.fieldIcon
                  }
                >
  
                  <Feather
                    name="mail"
                    size={16}
                    color={
                      COLORS.primary
                    }
                  />
  
                </View>
  
                <View
                  style={
                    styles.fieldTexts
                  }
                >
  
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    E-MAIL
                  </Text>
  
                  <Text
                    style={
                      styles.fieldValue
                    }
                    numberOfLines={1}
                  >
                    {email}
                  </Text>
  
                </View>
  
              </View>
  
  
              {/* CPF */}
  
              <View style={styles.field}>
  
                <View
                  style={
                    styles.fieldIcon
                  }
                >
  
                  <Feather
                    name="credit-card"
                    size={16}
                    color={
                      COLORS.primary
                    }
                  />
  
                </View>
  
                <View
                  style={
                    styles.fieldTexts
                  }
                >
  
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    CPF
                  </Text>
  
                  <Text
                    style={
                      styles.fieldValue
                    }
                    numberOfLines={1}
                  >
                    {cpf}
                  </Text>
  
                </View>
  
              </View>
  
  
              {/* SISTEMA */}
  
              <View style={styles.field}>
  
                <View
                  style={
                    styles.fieldIcon
                  }
                >
  
                  <Feather
                    name="grid"
                    size={16}
                    color={
                      COLORS.primary
                    }
                  />
  
                </View>
  
                <View
                  style={
                    styles.fieldTexts
                  }
                >
  
                  <Text
                    style={
                      styles.fieldLabel
                    }
                  >
                    SISTEMA / NÍVEL
                  </Text>
  
                  <Text
                    style={
                      styles.fieldValue
                    }
                    numberOfLines={1}
                  >
                    MEDSTOCK — Acesso Padrão
                  </Text>
  
                </View>
  
              </View>
  
            </View>
  
          </View>
  
  
         
          {/* ==================================================
              TROCAR CONTA
          ================================================== */}
  
          <Pressable
            style={[
              styles.actionButton,
              styles.switchButton,
            ]}
            onPress={() => {
  
              Alert.alert(
                "Trocar de Conta",
                "Deseja voltar para a tela de login?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
  
                  {
                    text: "Continuar",
  
                    onPress: () =>
                      navigation.replace(
                        "Login"
                      ),
                  },
                ]
              );
  
            }}
          >
  
            <MaterialCommunityIcons
              name="account-switch-outline"
              size={18}
              color={
                COLORS.primary
              }
            />
  
            <Text
              style={[
                styles.actionText,
                {
                  color:
                    COLORS.primary,
                },
              ]}
            >
              Trocar de Conta
            </Text>
  
          </Pressable>
  
  
          {/* ==================================================
              SAIR
          ================================================== */}
  
          <Pressable
            style={[
              styles.actionButton,
              styles.logoutButton,
            ]}
            onPress={() => {
  
              Alert.alert(
                "Sair da Conta",
                "Deseja realmente sair da conta?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
  
                  {
                    text: "Sair",
                    style: "destructive",
  
                    onPress: () =>
                      navigation.replace(
                        "Login"
                      ),
                  },
                ]
              );
  
            }}
          >
  
            <Feather
              name="log-out"
              size={16}
              color={
                COLORS.destructive
              }
            />
  
            <Text
              style={[
                styles.actionText,
                {
                  color:
                    COLORS.destructive,
                },
              ]}
            >
              Sair da Conta
            </Text>
  
          </Pressable>
  
  
          <View
            style={{
              height: 25,
            }}
          />
  
        </ScrollView>
  
  
        {/* ==================================================
            BARRA INFERIOR
        ================================================== */}

  
      </View>
    );
  }
  
  
  // ==========================================================
  // ESTILOS
  // ==========================================================
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },
  
  
    // ========================================================
    // LOADING
    // ========================================================
  
    loadingScreen: {
      flex: 1,
  
      backgroundColor:
        COLORS.background,
  
      alignItems: "center",
  
      justifyContent: "center",
    },
  
    loadingText: {
      marginTop: 12,
  
      fontSize: 14,
  
      color:
        COLORS.primary,
  
      fontWeight: "600",
    },
  
  
    // ========================================================
    // CABEÇALHO
    // ========================================================
  
    header: {
      paddingHorizontal: 16,
  
      paddingTop: 8,
  
      paddingBottom: 64,
    },
  
    headerRow: {
      flexDirection: "row",
  
      alignItems: "center",
  
      gap: 12,
    },
  
    headerTitle: {
      flex: 1,
  
      minWidth: 0,
  
      alignItems: "center",
    },
  
    brand: {
      color:
        COLORS.white,
  
      fontSize: 18,
  
      fontWeight: "800",
  
      letterSpacing: 0.5,
    },
  
    brandSubtitle: {
      color:
        "rgba(255,255,255,0.75)",
  
      fontSize: 13,
  
      letterSpacing: 2,
  
      marginTop: 2,
    },
  
    iconButton: {
      height: 45,
  
      width: 45,
  
      borderRadius: 14,
  
      backgroundColor:
        "rgba(255,255,255,0.18)",
  
      alignItems: "center",
  
      justifyContent: "center",
    },
  
    notificationDot: {
      position: "absolute",
  
      top: 10,
  
      right: 10,
  
      height: 8,
  
      width: 8,
  
      borderRadius: 4,
  
      backgroundColor:
        COLORS.teal,
    },
  
  
    // ========================================================
    // CONTEÚDO
    // ========================================================
  
    scroll: {
      flex: 1,
  
      marginTop: -48,
    },
  
    scrollContent: {
      paddingHorizontal: 16,
  
      paddingBottom: 110,
  
      gap: 14,
    },
  
  
    // ========================================================
    // CARDS
    // ========================================================
  
    card: {
      backgroundColor:
        COLORS.card,
  
      borderRadius: 24,
  
      shadowColor:
        "#12386E",
  
      shadowOpacity: 0.14,
  
      shadowRadius: 20,
  
      shadowOffset: {
        width: 0,
        height: 10,
      },
  
      elevation: 4,
    },
  
  
    // ========================================================
    // PERFIL
    // ========================================================
  
    profileCard: {
      alignItems: "center",
  
      paddingHorizontal: 20,
  
      paddingVertical: 40,
    },
  
    avatarContainer: {
      position: "relative",
    },
  
    avatar: {
      height: 80,
  
      width: 80,
  
      borderRadius: 40,
  
      backgroundColor:
        COLORS.muted,
  
      alignItems: "center",
  
      justifyContent: "center",
  
      borderWidth: 4,
  
      borderColor:
        COLORS.card,
    },
  
    onlineDot: {
      position: "absolute",
  
      bottom: 4,
  
      right: 4,
  
      height: 16,
  
      width: 16,
  
      borderRadius: 8,
  
      backgroundColor:
        COLORS.teal,
  
      borderWidth: 2,
  
      borderColor:
        COLORS.card,
    },
  
    name: {
      marginTop: 12,
  
      fontSize: 24,
  
      fontWeight: "800",
  
      color:
        COLORS.foreground,
  
      textAlign: "center",
    },
  
    role: {
      marginTop: 8,
  
      flexDirection: "row",
  
      alignItems: "center",
  
      gap: 6,
  
      backgroundColor:
        "rgba(63,199,199,0.16)",
  
      paddingHorizontal: 12,
  
      paddingVertical: 6,
  
      borderRadius: 999,
    },
  
    roleText: {
      color:
        COLORS.primary,
  
      fontSize: 14,
  
      fontWeight: "700",
    },
  
  
    // ========================================================
    // INFORMAÇÕES
    // ========================================================
  
    fields: {
      width: "100%",
  
      marginTop: 20,
  
      gap: 10,
    },
  
    field: {
      flexDirection: "row",
  
      alignItems: "center",
  
      gap: 12,
  
      borderWidth: 1,
  
      borderColor:
        COLORS.border,
  
      backgroundColor:
        COLORS.muted,
  
      borderRadius: 16,
  
      paddingHorizontal: 12,
  
      paddingVertical: 13,
    },
  
    fieldIcon: {
      height: 45,
  
      width: 45,
  
      borderRadius: 12,
  
      backgroundColor:
        COLORS.card,
  
      alignItems: "center",
  
      justifyContent: "center",
    },
  
    fieldTexts: {
      flex: 1,
  
      minWidth: 0,
    },
  
    fieldLabel: {
      fontSize: 13,
  
      fontWeight: "700",
  
      letterSpacing: 1.2,
  
      color:
        COLORS.mutedText,
    },
  
    fieldValue: {
      fontSize: 16.6,
  
      fontWeight: "700",
  
      color:
        COLORS.foreground,
  
      marginTop: 2,
    },
  
  
    // ========================================================
    // BOTÕES
    // ========================================================
  
    actionButton: {
      flexDirection: "row",
  
      alignItems: "center",
  
      justifyContent: "center",
  
      gap: 8,
  
      borderRadius: 16,
  
      paddingVertical: 15,
    },
  
    switchButton: {
      backgroundColor:
        "rgba(63,199,199,0.14)",
    },
  
    logoutButton: {
      backgroundColor:
        "rgba(217,83,79,0.12)",
    },
  
    actionText: {
      fontSize: 18,
  
      fontWeight: "700",
    },
  
  

    // ========================================================
    // ITEM
    // ========================================================
  
    tabItem: {
      flex: 1,
  
      height: 60,
  
      alignItems: "center",
  
      justifyContent: "center",
  
      gap: 4,
    },
  
  
    // ========================================================
    // TEXTO
    // ========================================================
  
    tabLabel: {
      fontSize: 13.5,
  
      color:
        COLORS.mutedText,
  
      fontWeight: "500",
  
      textAlign: "center",
    },
  
    tabLabelAtivo: {
      color:
        COLORS.primary,
  
      fontWeight: "700",
    },
  
  });