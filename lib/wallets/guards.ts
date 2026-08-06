export async function checkName(name: string): Promise<boolean> {
  if (!name) {
    return false;
  }
  if (name.trim().length < 3 || name.trim().length > 50) {
    return false;
  }
  return true;
}

export async function checkDescription(description: string): Promise<boolean> {
  if (!description) {
    return true;
  }
  if (description.trim().length > 80) {
    return false;
  }
  return true;
}
