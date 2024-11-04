import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device } from "../(routes)/appareils/components/ListDevices/ListDevice.type";

interface DeviceState {
  devices: Device[];
}

const initialState: DeviceState = {
  devices: [],
};

const DeviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices(state, action: PayloadAction<Device[]>) {
      state.devices = action.payload;
    },
    addDevice(state, action: PayloadAction<Device>) {
      state.devices.push(action.payload);
    },
    modifyDevice(state, action: PayloadAction<Device>) {
      const index = state.devices.findIndex(
        (device) => device.id === action.payload.id
      );
      console.log(action.payload);
      state.devices[index] = action.payload;
    },
    deleteDevice(state, action: PayloadAction<number>) {
      state.devices = state.devices.filter(
        (device) => device.id !== action.payload
      );
  },
}
});

export const { setDevices, addDevice , modifyDevice,deleteDevice } = DeviceSlice.actions;
export default DeviceSlice.reducer;
