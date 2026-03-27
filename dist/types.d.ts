import { z } from 'zod';
export declare const ProjectKeySchema: z.ZodObject<{
    projectKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
}, {
    projectKey: string;
}>;
export declare const RepoSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
}, {
    projectKey: string;
    repoSlug: string;
}>;
export declare const PullRequestSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
    prId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
    prId: number;
}, {
    projectKey: string;
    repoSlug: string;
    prId: number;
}>;
export declare const CreatePullRequestSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    fromBranch: z.ZodString;
    toBranch: z.ZodString;
    reviewers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
    title: string;
    fromBranch: string;
    toBranch: string;
    description?: string | undefined;
    reviewers?: string[] | undefined;
}, {
    projectKey: string;
    repoSlug: string;
    title: string;
    fromBranch: string;
    toBranch: string;
    description?: string | undefined;
    reviewers?: string[] | undefined;
}>;
export declare const AddCommentSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
    prId: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
    prId: number;
    text: string;
}, {
    projectKey: string;
    repoSlug: string;
    prId: number;
    text: string;
}>;
export declare const AddInlineCommentSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
    prId: z.ZodNumber;
    text: z.ZodString;
    filePath: z.ZodString;
    line: z.ZodNumber;
    lineType: z.ZodOptional<z.ZodEnum<["ADDED", "REMOVED", "CONTEXT"]>>;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
    prId: number;
    text: string;
    filePath: string;
    line: number;
    lineType?: "ADDED" | "REMOVED" | "CONTEXT" | undefined;
}, {
    projectKey: string;
    repoSlug: string;
    prId: number;
    text: string;
    filePath: string;
    line: number;
    lineType?: "ADDED" | "REMOVED" | "CONTEXT" | undefined;
}>;
export declare const ListPullRequestsSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
    state: z.ZodOptional<z.ZodEnum<["OPEN", "MERGED", "DECLINED", "ALL"]>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
    state?: "OPEN" | "MERGED" | "DECLINED" | "ALL" | undefined;
    limit?: number | undefined;
}, {
    projectKey: string;
    repoSlug: string;
    state?: "OPEN" | "MERGED" | "DECLINED" | "ALL" | undefined;
    limit?: number | undefined;
}>;
export declare const ListSchema: z.ZodObject<{
    projectKey: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    limit?: number | undefined;
}, {
    projectKey: string;
    limit?: number | undefined;
}>;
export declare const BranchesSchema: z.ZodObject<{
    projectKey: z.ZodString;
    repoSlug: z.ZodString;
    filterText: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectKey: string;
    repoSlug: string;
    limit?: number | undefined;
    filterText?: string | undefined;
}, {
    projectKey: string;
    repoSlug: string;
    limit?: number | undefined;
    filterText?: string | undefined;
}>;
//# sourceMappingURL=types.d.ts.map