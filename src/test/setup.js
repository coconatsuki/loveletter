import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Firebase
vi.mock("../utils/firebase", () => ({
  db: {},
  // Mock other Firebase exports as needed
}));
