# Prompt: Improve Architecture

**Objective**: Refactor code to follow the Repository and Layered pattern.

**Instructions**:
1. Identify database or business logic inside the UI layer.
2. Create or update the relevant Repository in `/repositories`.
3. Move orchestration logic into a Service or Server Action.
4. Update the UI to call the new service/action instead of direct DB access.
5. Ensure strict separation of concerns is maintained.

Broadway
