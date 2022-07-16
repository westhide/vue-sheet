// @vitest-environment jsdom

import { mount } from "@vue/test-utils";
import Todo from "./index.vue";

describe("Components", () => {
  it("Todo.vue", () => {
    const wrapper = mount(Todo);
    const dom = wrapper.get('[data-test="test"]');
    expect(dom.text()).toMatchInlineSnapshot('"Hello Todo"');
  });
});
