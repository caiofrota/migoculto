// src/screens/CreateGroupScreen.tsx
import { apiService } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGroupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [location, setLocation] = useState("");

  const [eventDate, setEventDate] = useState(new Date());

  const [iosPickerMode, setIosPickerMode] = useState<"date" | "time">("date");
  const [iosPickerVisible, setIosPickerVisible] = useState(false);

  const applyDatePart = (selected: Date) => {
    const updated = new Date(eventDate);
    updated.setFullYear(selected.getFullYear());
    updated.setMonth(selected.getMonth());
    updated.setDate(selected.getDate());
    setEventDate(updated);
  };

  const applyTimePart = (selected: Date) => {
    const updated = new Date(eventDate);
    updated.setHours(selected.getHours());
    updated.setMinutes(selected.getMinutes());
    setEventDate(updated);
  };

  const openAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: eventDate,
      mode: "date",
      is24Hour: true,
      onChange: (_event, selected) => {
        if (selected) applyDatePart(selected);
      },
    });
  };

  const openAndroidTimePicker = () => {
    DateTimePickerAndroid.open({
      value: eventDate,
      mode: "time",
      is24Hour: true,
      onChange: (_event, selected) => {
        if (selected) applyTimePart(selected);
      },
    });
  };

  const handleDatePress = () => {
    if (Platform.OS === "android") {
      openAndroidDatePicker();
    } else {
      setIosPickerMode("date");
      setIosPickerVisible(true);
    }
  };

  const handleTimePress = () => {
    if (Platform.OS === "android") {
      openAndroidTimePicker();
    } else {
      setIosPickerMode("time");
      setIosPickerVisible(true);
    }
  };

  const handleIosPickerChange = (_: any, selected?: Date) => {
    if (!selected) return;

    if (iosPickerMode === "date") {
      applyDatePart(selected);
    } else {
      applyTimePart(selected);
    }
  };

  const handleCreate = async () => {
    try {
      await apiService.group.create({
        name,
        password,
        description: description || undefined,
        additionalInfo: additionalInfo || undefined,
        location: location || undefined,
        eventDate: eventDate.toISOString(),
      });

      router.dismissAll();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          <Text style={styles.headerBackText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Criar novo grupo</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Nome do grupo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Natal da Família"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Senha do grupo</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha para entrar no grupo"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Ex: Amigo secreto entre primos..."
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Informações adicionais (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Ex: Presentes entre 50 e 100 reais"
          placeholderTextColor="#aaa"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />

        <Text style={styles.label}>Local (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Minha casa"
          placeholderTextColor="#aaa"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Data do evento</Text>
        <TouchableOpacity style={styles.dateButton} onPress={handleDatePress} activeOpacity={0.8}>
          <Ionicons name="calendar" size={20} color="#FFE6D5" />
          <Text style={styles.dateButtonText}>{eventDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Hora do evento</Text>
        <TouchableOpacity style={styles.dateButton} onPress={handleTimePress} activeOpacity={0.8}>
          <Ionicons name="time" size={20} color="#FFE6D5" />
          <Text style={styles.dateButtonText}>
            {eventDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Criar grupo</Text>
        </TouchableOpacity>
      </ScrollView>

      {Platform.OS === "ios" && iosPickerVisible && (
        <TouchableWithoutFeedback onPress={() => setIosPickerVisible(false)}>
          <View style={styles.iosBackdrop}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.iosSheet,
                  {
                    backgroundColor: isDark ? "#1C1C1E" : "#F2F2F7",
                  },
                ]}
              >
                <View style={styles.iosSheetHeader}>
                  <Text style={[styles.iosSheetHeaderTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                    {iosPickerMode === "date" ? "Selecionar data" : "Selecionar hora"}
                  </Text>

                  <TouchableOpacity onPress={() => setIosPickerVisible(false)}>
                    <Text style={[styles.iosSheetHeaderButton, { color: "#007AFF" }]}>OK</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={eventDate}
                  mode={iosPickerMode}
                  display="spinner"
                  onChange={handleIosPickerChange}
                  style={{ width: 100 }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B0000",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerBackText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 140,
  },
  label: {
    color: "#FCE9B3",
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 15,
    marginBottom: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  createButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },

  iosBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  iosSheet: {
    flexDirection: "column",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iosSheetHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  iosSheetHeaderButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  iosSheetHeaderTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});
