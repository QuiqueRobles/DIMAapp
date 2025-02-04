import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EventsManage from "@/screens/EventManageScreen";
import { useClub } from "@/context/EventContext";
import { supabase } from "@/lib/supabase";

// Mock useClub context
jest.mock("../../src/context/EventContext", () => ({
  useClub: jest.fn(),
}));

// Mock Supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
    })),
  },
}));

const mockEvents = [
  {
    id: "1",
    name: "Test Event",
    date: "2024-02-10",
    club_id: "123",
    created_at: "2024-01-01",
    price: 20,
    description: "A test event",
    image: null,
  },
];

// Mock context return values
const mockSetEvents = jest.fn();
const mockSetClubId = jest.fn();

beforeEach(() => {
  useClub.mockReturnValue({
    events: mockEvents,
    clubId: "123",
    addEvent: jest.fn(),
    setEvents: mockSetEvents,
    setClubId: mockSetClubId,
  });

  supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "123" } } });
});

describe("EventsManage Component", () => {
  it("renders correctly", async () => {
    const { getByText } = render(<EventsManage />);
    await waitFor(() => {
      expect(getByText("Today's events:")).toBeTruthy();
      expect(getByText("Test Event")).toBeTruthy();
    });
  });

  it("displays the calendar", async () => {
    const { getByTestId } = render(<EventsManage />);
    await waitFor(() => {
      expect(getByTestId("calendar")).toBeTruthy();
    });
  });

  it("opens the Add Event modal", async () => {
    const { getByTestId, getByText } = render(<EventsManage />);
    
    const addButton = getByTestId("add-event-button");
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(getByText("Add Event")).toBeTruthy();
    });
  });

  it("fetches events from Supabase", async () => {
    render(<EventsManage />);
    await waitFor(() => {
      expect(mockSetEvents).toHaveBeenCalledWith(mockEvents);
    });
  });
});
