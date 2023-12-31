import { CardComponent, CardConfigTypes } from "../models/cardComponent";

import classNames from "classnames";
import {
  CompositionMethod,
  useComposedCssClasses,
} from "../../hooks/useComposedCssClasses";
import { useSearchState, Result } from "@yext/search-headless-react";
import * as React from "react";

interface VerticalResultsCssClasses {
  container?: string;
  labelContainer?: string;
  label?: string;
  selectedLabel?: string;
  leftIconContainer?: string;
  rightIconContainer?: string;
  icon?: string;
  results___loading?: string;
  verticalResultsContainer?: string;
}

const builtInCssClasses: VerticalResultsCssClasses = {
  results___loading: "opacity-50",
};

interface VerticalResultsDisplayProps {
  CardComponent: CardComponent;
  cardConfig?: CardConfigTypes;
  isLoading?: boolean;
  results: Result[];
  customCssClasses?: VerticalResultsCssClasses;
  cssCompositionMethod?: CompositionMethod;
}

/**
 * Function to  Display Vertical Results
 * @param props : Vertical data
 * @returns : result
 */
export function VerticalResultsDisplay(
  props: VerticalResultsDisplayProps
): JSX.Element | null {
  const {
    CardComponent,
    results,
    cardConfig = {},
    isLoading = false,
    customCssClasses,
    cssCompositionMethod,
  } = props;
  const cssClasses = useComposedCssClasses(
    builtInCssClasses,
    customCssClasses,
    cssCompositionMethod
  );
  const [currentActiveOpenClose, setCurrentActiveOpenClose] = React.useState<
    string | null
  >(null);

  if (results.length === 0) {
    return null;
  }

  const resultsClassNames = classNames({
    [cssClasses.results___loading ?? ""]: isLoading,
  });

  React.useEffect(() => {
    if (isLoading) {
      setCurrentActiveOpenClose(null);
    }

    return () => {
      setCurrentActiveOpenClose(null);
    };
  }, [isLoading]);

  return (
    <div className={resultsClassNames}>
      {results &&
        results.map((result) =>
          renderResult(
            CardComponent,
            cardConfig,
            result,
            currentActiveOpenClose,
            setCurrentActiveOpenClose
          )
        )}
    </div>
  );
}

function renderResult(
  CardComponent: CardComponent,
  cardConfig: CardConfigTypes,
  result: Result,
  currentActiveOpenClose: string | null,
  setCurrentActiveOpenClose: (value: string | null) => void
): JSX.Element {
  return (
    <CardComponent
      result={result}
      configuration={cardConfig}
      key={result.id || result.index}
      currentActiveOpenClose={currentActiveOpenClose}
      setCurrentActiveOpenClose={(value: string | null) =>
        setCurrentActiveOpenClose(value)
      }
    />
  );
}

interface VerticalResultsProps {
  CardComponent: CardComponent;
  cardConfig?: CardConfigTypes;
  displayAllOnNoResults?: boolean;
  customCssClasses?: VerticalResultsCssClasses;
  cssCompositionMethod?: CompositionMethod;
  locationResults: [];
}

export default function VerticalResults(
  props: VerticalResultsProps
): JSX.Element | null {
  const { displayAllOnNoResults = false, ...otherProps } = props;
  const verticalResults = props.locationResults || [];
  const allResultsForVertical =
    useSearchState(
      (state) => state.vertical?.noResults?.allResultsForVertical.results
    ) || [];
  const isLoading = useSearchState((state) => state.searchStatus.isLoading);

  let results: Result<Record<string, unknown>>[] = verticalResults;
  if (verticalResults.length === 0 && displayAllOnNoResults) {
    results = allResultsForVertical;
  }

  return (
    <>
      <VerticalResultsDisplay
        results={results}
        isLoading={isLoading}
        {...otherProps}
      />
    </>
  );
}
