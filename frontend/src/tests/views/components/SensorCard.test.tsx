import React from "react";
import SensorCard from "../../../views/components/SensorCard";
import { render } from "@testing-library/react-native";

describe("Componente SensorCard (UI Test)", () => {
  // TESTE DE UI
  // Verifica se o componente renderiza corretamente o rótulo, valor e status do sensor
  it("deve renderizar corretamente o rótulo, valor e status do sensor", async () => {
    const { getByText } = await render(
      <SensorCard
        iconName="thermometer-outline"
        label="Temperatura"
        value="25°C"
        status="Normal"
        statusColor="#4CAF50"
        iconColor="#FF6B6B"
        progress={62}
      />,
    );

    expect(getByText("Temperatura")).toBeTruthy();
    expect(getByText("25°C")).toBeTruthy();
    expect(getByText("Normal")).toBeTruthy();
  });
});
