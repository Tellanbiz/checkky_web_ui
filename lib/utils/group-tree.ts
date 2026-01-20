import type { Group } from "@/lib/services/groups";

export interface GroupTreeNode {
    group: Group;
    children: GroupTreeNode[];
}

const normalizeParentId = (parentId?: string | null) => {
    if (!parentId || parentId === "0") {
        return null;
    }
    return parentId;
};

export const buildGroupTree = (
    groups: Group[],
    sortFn?: (a: Group, b: Group) => number
): GroupTreeNode[] => {
    const groupMap = new Map<string, GroupTreeNode>();

    groups.forEach((group) => {
        groupMap.set(group.id, { group, children: [] });
    });

    const roots: GroupTreeNode[] = [];

    groupMap.forEach((node) => {
        const parentId = normalizeParentId(node.group.parent_group_id);
        if (parentId && groupMap.has(parentId)) {
            groupMap.get(parentId)!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    const sortNodes = (nodes: GroupTreeNode[]) => {
        if (sortFn) {
            nodes.sort((a, b) => sortFn(a.group, b.group));
        }
        nodes.forEach((node) => sortNodes(node.children));
    };

    sortNodes(roots);
    return roots;
};
