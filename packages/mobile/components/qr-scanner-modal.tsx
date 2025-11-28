import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect } from "react";
import { ActivityIndicator, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface QrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onCodeScanned: (data: string) => void;
}

const SCAN_SIZE = 260;
const CORNER_SIZE = 40;
const CORNER_THICKNESS = 4;

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ visible, onClose, onCodeScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible && !permission) {
      requestPermission();
    }
  }, [permission, requestPermission, visible]);

  const handleBarcodeScanned = (result: { data: string }) => {
    onClose();
    onCodeScanned(result.data);
  };

  const renderBody = () => {
    if (!permission) {
      return (
        <View style={styles.centerBody}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.infoText}>Solicitando acesso à câmera…</Text>
        </View>
      );
    }

    if (!permission.granted) {
      const handleOpenSettings = () => {
        Linking.openSettings();
      };

      return (
        <View style={styles.centerBody}>
          <Text style={styles.infoText}>
            Sem permissão para acessar a câmera.{"\n"}
            Você pode permitir o acesso nas configurações do app.
          </Text>

          {permission.canAskAgain ? (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Permitir câmera</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.permissionButton} onPress={handleOpenSettings}>
              <Text style={styles.permissionButtonText}>Abrir configurações</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.overlay}>
            <View style={styles.overlayRow} />
            <View style={styles.overlayCenterRow}>
              <View style={styles.overlaySide} />
              <View style={styles.cornerBox}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayRow} />
          </View>
        </View>
        <View style={styles.helpTextWrapper}>
          <Text style={styles.helpText}>Aponte o código para dentro da área marcada</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={[styles.headerAbsolute, { top: insets.top || 0 }]}>
          <TouchableOpacity style={styles.headerBackButton} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escanear código do grupo</Text>
          <View style={{ width: 72 }} />
        </View>
        <View style={styles.flexFill}>{renderBody()}</View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  flexFill: {
    flex: 1,
  },
  headerAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 999,
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cameraWrapper: {
    flex: 1,
  },
  centerBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  infoText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#E53935",
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
  },
  overlayRow: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayCenterRow: {
    height: SCAN_SIZE,
    flexDirection: "row",
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  cornerBox: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "#FFFFFF",
    borderWidth: CORNER_THICKNESS,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  helpTextWrapper: {
    position: "absolute",
    bottom: 32,
    width: "100%",
    alignItems: "center",
  },
  helpText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
